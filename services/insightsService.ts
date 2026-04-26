import { supabase } from "@/lib/supabase";
import { FinancialInsight } from "@/types/insights";

const HF_SPACE_URL = "https://orbit05-datathon206.hf.space";

/**
 * Mock data de insights financieros (fallback cuando el API no está disponible)
 */
const MOCK_INSIGHTS: FinancialInsight[] = [
  {
    user_id: "USR-09709",
    cluster: 0,
    segment_name: "Inversor premium",
    insight_type: "upsell_investment",
    insight_text:
      "Con un score de buró de 834 y ya invirtiendo activamente, tu perfil financiero está en un nivel que pocas personas alcanzan. Hey Pro podría potenciar tus rendimientos con beneficios exclusivos diseñados para perfiles como el tuyo, especialmente considerando que tu gasto anual supera los $445,000 pesos. Entra a la app hoy y revisa la simulación de Hey Pro para ver exactamente cuánto más podrías estar ganando.",
    status: "ok",
    score_buro: 834,
    utilizacion_credito_pct: 27.0,
    gasto_total_anual_mxn: 445165,
    tasa_fallos_pct: 4.7,
  },
  {
    user_id: "USR-14607",
    cluster: 0,
    segment_name: "Inversor premium",
    insight_type: "upsell_investment",
    insight_text:
      "Tu portafolio de inversión está activo y tu score de 771 refleja una salud financiera sólida, pero llevas 16 días sin revisar cómo está rindiendo tu dinero. Con un gasto anual de $933,753 pesos, podrías estar aprovechando rendimientos más competitivos diversificando hacia instrumentos de mayor plazo dentro de Hey Banco. Entra hoy a la app y explora las opciones de inversión disponibles para tu perfil Hey Pro, podría marcar una diferencia real en tus rendimientos este año.",
    status: "ok",
    score_buro: 771,
    utilizacion_credito_pct: 5.7,
    gasto_total_anual_mxn: 933753,
    tasa_fallos_pct: 3.0,
  },
  {
    user_id: "USR-02047",
    cluster: 1,
    segment_name: "Nativo digital",
    insight_type: "upsell_digital",
    insight_text:
      "El 3.7% de tu gasto anual ya se va directo en servicios digitales, y con $292,180 al año en movimiento, ese porcentaje se convierte en lana real que podrías estar recuperando. Con Hey Pro, ese gasto en suscripciones y plataformas te generaría cashback directo en cada cobro recurrente, algo que hoy literalmente tienes en cero. Entra a la app y checa cuánto cashback habrías acumulado este año si ya tuvieras Hey Pro, el simulador te lo muestra en segundos.",
    status: "ok",
    score_buro: 711,
    utilizacion_credito_pct: 48.4,
    gasto_total_anual_mxn: 292180,
    tasa_fallos_pct: 3.3,
  },
  {
    user_id: "USR-13405",
    cluster: 4,
    segment_name: "Empresario diversificado",
    insight_type: "upsell_business",
    insight_text:
      "Con un score de buró de 758 y solo 21.3% de utilización de crédito, tu perfil financiero está en un punto ideal para escalar tu negocio sin comprometer tu liquidez. Tus $387,637 en gasto anual demuestran una operación activa que merece una línea de crédito empresarial más amplia para aprovechar mejores condiciones. Entra a Hey Banco hoy y solicita la expansión de tu línea de crédito de negocios, podrías acceder a mayor capital sin afectar tu excelente historial crediticio.",
    status: "ok",
    score_buro: 758,
    utilizacion_credito_pct: 21.3,
    gasto_total_anual_mxn: 387637,
    tasa_fallos_pct: 3.2,
  },
  {
    user_id: "USR-01252",
    cluster: 2,
    segment_name: "Pagador gobierno / Pasivo",
    insight_type: "retention_reactivation",
    insight_text:
      "Llevas 165 días sin abrir tu app de Hey Banco, pero tu cuenta sigue trabajando para ti con cada pago de gobierno que realizas. Lo que quizás no sabes es que podrías estar ganando cashback real en esas transacciones, y hasta ahora llevas $0 acumulados porque no has activado esa función. Entra hoy a la app, revisa la sección de beneficios y activa tu cashback antes de tu próximo pago.",
    status: "ok",
    score_buro: 389,
    utilizacion_credito_pct: 0.0,
    gasto_total_anual_mxn: 23019,
    tasa_fallos_pct: 7.7,
  },
  {
    user_id: "USR-05620",
    cluster: 5,
    segment_name: "Inactivo en riesgo",
    insight_type: "retention_churn_risk",
    insight_text:
      "Hace **140 días** que no nos visitas y eso nos dice que algo no está funcionando como debería para ti. Con casi 3 años siendo parte de Hey Banco, queremos asegurarnos de que tu cuenta siga siendo útil en tu día a día. Entra hoy a la app y revisa las opciones de inversión disponibles desde $1 peso — puede ser el primer paso para sacarle más jugo a tu dinero sin complicaciones.",
    status: "ok",
    score_buro: 584,
    utilizacion_credito_pct: 0.0,
    gasto_total_anual_mxn: 36106,
    tasa_fallos_pct: 0.0,
  },
  {
    user_id: "USR-02897",
    cluster: 3,
    segment_name: "Asalariado fiel",
    insight_type: "loyalty_payroll",
    insight_text:
      "Llevas más de 4 años con tu nómina domiciliada en Hey Banco y eso tiene valor real. Con un ingreso mensual de $22,500 y 3 productos activos, ya tienes una base sólida, pero tu dinero podría estar trabajando más para ti. Activa Hey Pro para acceder a beneficios exclusivos de nómina y empieza a generar rendimientos sin mover un peso de donde ya tienes todo.",
    status: "ok",
    score_buro: 553,
    utilizacion_credito_pct: 54.5,
    gasto_total_anual_mxn: 276284,
    tasa_fallos_pct: 3.0,
  },
  {
    user_id: "USR-05767",
    cluster: 6,
    segment_name: "Estresado financiero",
    insight_type: "financial_stress_relief",
    insight_text:
      "Tu tasa de pagos fallidos del 10.8% puede estar afectando tu historial crediticio y generando cargos innecesarios que se comen parte de tus $18,000 mensuales. Con tu nómina domiciliada en Hey Banco, tienes una ventaja real para estabilizar tus finanzas desde la raíz. Revisa en la app qué pagos están fallando y activa las alertas de saldo para evitar que un descuido te cueste más puntos en buró.",
    status: "ok",
    score_buro: 556,
    utilizacion_credito_pct: 0.0,
    gasto_total_anual_mxn: 171873,
    tasa_fallos_pct: 10.8,
  },
];

/**
 * Llama al endpoint real del HF Space para obtener el insight del usuario.
 * Retorna null si el servicio no está disponible.
 */
async function fetchInsightFromAPI(
  userId: string,
  language = "es",
): Promise<FinancialInsight | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const resp = await fetch(`${HF_SPACE_URL}/segmentacion/insight/existing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, language }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) return null;

    const data = await resp.json();
    // El endpoint puede devolver el objeto directamente o dentro de { response: {...} }
    const insight: unknown = data?.response ?? data;

    if (
      insight &&
      typeof insight === "object" &&
      "insight_text" in insight &&
      "cluster" in insight
    ) {
      return { ...(insight as FinancialInsight), user_id: userId };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Lee los insights activos del usuario desde la tabla user_insights (Supabase).
 * Generados automáticamente por triggers + Lambda + MCP.
 */
async function fetchInsightsFromDB(
  userId: string,
): Promise<FinancialInsight[]> {
  const { data, error } = await supabase
    .from("user_insights")
    .select(
      "user_id, cluster, segment_name, insight_type, insight_text, status, " +
        "score_buro, utilizacion_credito_pct, gasto_total_anual_mxn, tasa_fallos_pct, " +
        "created_at, expires_at",
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data || data.length === 0) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => ({
    user_id: row.user_id,
    cluster: row.cluster ?? 0,
    segment_name: row.segment_name ?? "Sin segmento",
    insight_type: row.insight_type ?? "retention_reactivation",
    insight_text: row.insight_text,
    status: row.status ?? "ok",
    score_buro: row.score_buro ?? 0,
    utilizacion_credito_pct: row.utilizacion_credito_pct ?? 0,
    gasto_total_anual_mxn: row.gasto_total_anual_mxn ?? 0,
    tasa_fallos_pct: row.tasa_fallos_pct ?? 0,
  })) as FinancialInsight[];
}

/**
 * Obtiene el insight personalizado del usuario.
 * Fuente principal: tabla user_insights (generada por triggers).
 * Fallback: HF Space → mock.
 */
export async function getUserInsights(
  userId: string,
): Promise<FinancialInsight[]> {
  // 1. Intentar leer insights pre-generados desde Supabase
  const dbInsights = await fetchInsightsFromDB(userId);
  if (dbInsights.length > 0) return dbInsights;

  // 2. Fallback: llamar al HF Space directamente
  const real = await fetchInsightFromAPI(userId);
  if (real) return [real];

  // 3. Fallback final: mock
  const randomInsight =
    MOCK_INSIGHTS[Math.floor(Math.random() * MOCK_INSIGHTS.length)];
  return [{ ...randomInsight, user_id: userId }];
}

/**
 * Obtiene el insight principal para mostrar en Home
 */
export async function getPrimaryInsight(
  userId: string,
): Promise<FinancialInsight | null> {
  const insights = await getUserInsights(userId);
  return insights.length > 0 ? insights[0] : null;
}

/**
 * Formatea el gasto anual a formato legible
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Obtiene el color del score de buró
 */
export function getBuroScoreColor(score: number): string {
  if (score >= 750) return "#10b981"; // Verde - Excelente
  if (score >= 650) return "#3b82f6"; // Azul - Bueno
  if (score >= 550) return "#f59e0b"; // Amarillo - Regular
  return "#ef4444"; // Rojo - Necesita atención
}

/**
 * Obtiene el nivel del score de buró
 */
export function getBuroScoreLevel(score: number): string {
  if (score >= 750) return "Excelente";
  if (score >= 650) return "Bueno";
  if (score >= 550) return "Regular";
  return "Necesita atención";
}
