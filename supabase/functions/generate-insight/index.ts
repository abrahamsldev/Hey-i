import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const LAMBDA_BASE_URL = Deno.env.get("LAMBDA_BASE_URL")!;
const INSIGHTS_INTERNAL_SECRET = Deno.env.get("INSIGHTS_INTERNAL_SECRET")!;

// ─── Tipos ────────────────────────────────────────────────────────────────────

type TriggerType =
  | "cargo_fallido_reciente"
  | "credito_al_limite"
  | "sin_login_reciente"
  | "nomina_sin_inversion"
  | "suscripcion_sin_uso"
  | "gasto_inusual"
  | "baja_satisfaccion";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown> | null;
}

interface DetectedTrigger {
  trigger: TriggerType;
  data: Record<string, unknown>;
}

// ─── Lógica de detección ──────────────────────────────────────────────────────

function hoursAgo(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
}

function detectTrigger(payload: WebhookPayload): DetectedTrigger | null {
  const { table, record, old_record } = payload;

  // ── user_transactions ──────────────────────────────────────────────────────
  if (table === "user_transactions") {
    const fecha = record.fecha_hora as string | undefined;

    // Cargo fallido reciente (últimas 24h)
    if (record.estatus === "no_procesada" && fecha && hoursAgo(fecha) <= 24) {
      return {
        trigger: "cargo_fallido_reciente",
        data: {
          motivo: record.motivo_no_procesada,
          monto: record.monto,
          categoria_mcc: record.categoria_mcc,
          fecha_hora: record.fecha_hora,
        },
      };
    }

    // Cargo recurrente: posible suscripción sin uso
    if (record.tipo_operacion === "cargo_recurrente") {
      return {
        trigger: "suscripcion_sin_uso",
        data: {
          monto: record.monto,
          categoria_mcc: record.categoria_mcc,
          comercio_nombre: record.comercio_nombre,
          fecha_hora: record.fecha_hora,
        },
      };
    }

    // Gasto inusual: monto muy diferente al histórico
    // El webhook puede incluir un campo calculado `es_gasto_inusual`
    if (record.es_gasto_inusual === true) {
      return {
        trigger: "gasto_inusual",
        data: {
          monto: record.monto,
          categoria_mcc: record.categoria_mcc,
          comercio_nombre: record.comercio_nombre,
          fecha_hora: record.fecha_hora,
        },
      };
    }
  }

  // ── user_profiles ──────────────────────────────────────────────────────────
  if (table === "user_profiles") {
    const diasLogin = record.dias_desde_ultimo_login as number | undefined;
    const satisfaccion = record.satisfaccion_1_10 as number | undefined;
    const nominaDomiciliada = record.nomina_domiciliada as boolean | undefined;

    // Baja satisfacción
    if (satisfaccion !== undefined && satisfaccion < 6) {
      return {
        trigger: "baja_satisfaccion",
        data: { satisfaccion_1_10: satisfaccion },
      };
    }

    // Sin login reciente
    if (diasLogin !== undefined && diasLogin > 15) {
      // Solo disparar si el valor cambió (UPDATE) o si es un INSERT con ese valor
      const oldDias = old_record?.dias_desde_ultimo_login as number | undefined;
      if (oldDias === undefined || oldDias <= 15) {
        return {
          trigger: "sin_login_reciente",
          data: { dias_desde_ultimo_login: diasLogin },
        };
      }
    }

    // Nómina domiciliada (INSERT o cuando se activa)
    if (nominaDomiciliada === true) {
      const oldNomina = old_record?.nomina_domiciliada as boolean | undefined;
      if (oldNomina !== true) {
        return {
          trigger: "nomina_sin_inversion",
          data: { nomina_domiciliada: true },
        };
      }
    }
  }

  // ── user_segments ──────────────────────────────────────────────────────────
  if (table === "user_segments") {
    const maxUtilizacion = record.max_utilizacion_z as number | undefined;
    const hasInversion = record.has_inversion_z as number | undefined;

    // Crédito al límite (z-score > 1.5 = desviación alta)
    if (maxUtilizacion !== undefined && maxUtilizacion > 1.5) {
      const oldVal = old_record?.max_utilizacion_z as number | undefined;
      if (oldVal === undefined || oldVal <= 1.5) {
        return {
          trigger: "credito_al_limite",
          data: { max_utilizacion_z: maxUtilizacion },
        };
      }
    }

    // Nómina domiciliada sin inversión
    if (hasInversion !== undefined && hasInversion < 0) {
      const oldVal = old_record?.has_inversion_z as number | undefined;
      if (oldVal === undefined || oldVal >= 0) {
        return {
          trigger: "nomina_sin_inversion",
          data: { has_inversion_z: hasInversion },
        };
      }
    }
  }

  return null;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const payload: WebhookPayload = await req.json();
    const userId = payload.record?.user_id as string | undefined;

    if (!userId) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "no user_id" }),
        { status: 200 },
      );
    }

    const detected = detectTrigger(payload);
    if (!detected) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "no matching trigger" }),
        { status: 200 },
      );
    }

    const lambdaRes = await fetch(`${LAMBDA_BASE_URL}/insights/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INSIGHTS_INTERNAL_SECRET,
      },
      body: JSON.stringify({
        user_id: userId,
        trigger_type: detected.trigger,
        trigger_data: detected.data,
      }),
    });

    const result = await lambdaRes.json();
    return new Response(JSON.stringify(result), { status: lambdaRes.status });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
});
