import { AppHeader } from "@/components/AppHeader";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
    colors,
    fontSize,
    fontWeight,
    radius,
    spacing,
} from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface TriggerDef {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  run: (userId: string) => Promise<void>;
}

// ─── Queries por trigger ─────────────────────────────────────────────────────

function buildTriggers(userId: string): TriggerDef[] {
  return [
    {
      id: "cargo_fallido_reciente",
      label: "Cargo fallido reciente",
      description: "Inserta una transacción no procesada en las últimas 24h",
      icon: "close-circle-outline",
      color: "#ef4444",
      run: async () => {
        const { error } = await supabase.from("user_transactions").insert({
          user_id: userId,
          tipo_operacion: "pago",
          estatus: "no_procesada",
          fecha_hora: new Date().toISOString(),
          motivo_no_procesada: "fondos_insuficientes",
          monto: 1000.0,
          categoria_mcc: "restaurants",
        });
        if (error) throw new Error(error.message);
      },
    },
    {
      id: "suscripcion_sin_uso",
      label: "Suscripción sin uso",
      description: "Inserta un cargo recurrente (streaming)",
      icon: "repeat-outline",
      color: "#8b5cf6",
      run: async () => {
        const { error } = await supabase.from("user_transactions").insert({
          user_id: userId,
          tipo_operacion: "cargo_recurrente",
          estatus: "procesada",
          fecha_hora: new Date().toISOString(),
          monto: 299.0,
          categoria_mcc: "streaming",
          comercio_nombre: "Netflix",
        });
        if (error) throw new Error(error.message);
      },
    },
    {
      id: "gasto_inusual",
      label: "Gasto inusual",
      description: "Inserta una transacción con es_gasto_inusual = true",
      icon: "alert-circle-outline",
      color: "#f59e0b",
      run: async () => {
        // Primero verificar si la columna existe, si no agregar valor directamente
        const { error } = await supabase.from("user_transactions").insert({
          user_id: userId,
          tipo_operacion: "pago",
          estatus: "procesada",
          fecha_hora: new Date().toISOString(),
          monto: 12500.0,
          categoria_mcc: "electronics",
          comercio_nombre: "Apple Store",
          es_gasto_inusual: true,
        } as any);
        if (error) throw new Error(error.message);
      },
    },
    {
      id: "baja_satisfaccion",
      label: "Baja satisfacción",
      description: "Actualiza satisfaccion_1_10 = 3 en tu perfil",
      icon: "sad-outline",
      color: "#ec4899",
      run: async () => {
        const { error } = await supabase
          .from("user_profiles")
          .update({ satisfaccion_1_10: 3 })
          .eq("user_id", userId);
        if (error) throw new Error(error.message);
      },
    },
    {
      id: "sin_login_reciente",
      label: "Sin login reciente",
      description: "Sube dias_desde_ultimo_login de 10 → 20 (cruza umbral)",
      icon: "time-outline",
      color: "#06b6d4",
      run: async () => {
        const { error: e1 } = await supabase
          .from("user_profiles")
          .update({ dias_desde_ultimo_login: 10 })
          .eq("user_id", userId);
        if (e1) throw new Error(e1.message);
        // Pequeña pausa para que Supabase procese el primer webhook antes del segundo
        await new Promise((r) => setTimeout(r, 500));
        const { error: e2 } = await supabase
          .from("user_profiles")
          .update({ dias_desde_ultimo_login: 20 })
          .eq("user_id", userId);
        if (e2) throw new Error(e2.message);
      },
    },
    {
      id: "nomina_sin_inversion",
      label: "Nómina sin inversión",
      description: "Activa nomina_domiciliada de false → true",
      icon: "wallet-outline",
      color: "#10b981",
      run: async () => {
        const { error: e1 } = await supabase
          .from("user_profiles")
          .update({ nomina_domiciliada: false })
          .eq("user_id", userId);
        if (e1) throw new Error(e1.message);
        await new Promise((r) => setTimeout(r, 500));
        const { error: e2 } = await supabase
          .from("user_profiles")
          .update({ nomina_domiciliada: true })
          .eq("user_id", userId);
        if (e2) throw new Error(e2.message);
      },
    },
    {
      id: "credito_al_limite",
      label: "Crédito al límite",
      description: "Sube max_utilizacion_z de 1.0 → 2.1 en segmento",
      icon: "trending-up-outline",
      color: "#f97316",
      run: async () => {
        const { error: e1 } = await supabase
          .from("user_segments")
          .update({ max_utilizacion_z: 1.0 })
          .eq("user_id", userId);
        if (e1) throw new Error(e1.message);
        await new Promise((r) => setTimeout(r, 500));
        const { error: e2 } = await supabase
          .from("user_segments")
          .update({ max_utilizacion_z: 2.1 })
          .eq("user_id", userId);
        if (e2) throw new Error(e2.message);
      },
    },
  ];
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function SimulatorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, "ok" | "error">>({});

  const triggers = buildTriggers(user?.id ?? "");

  const handleRun = async (trigger: TriggerDef) => {
    if (!user?.id) {
      Alert.alert("Error", "No hay usuario autenticado");
      return;
    }
    setRunning(trigger.id);
    try {
      await trigger.run(user.id);
      setResults((prev) => ({ ...prev, [trigger.id]: "ok" }));
    } catch (err: any) {
      setResults((prev) => ({ ...prev, [trigger.id]: "error" }));
      Alert.alert("Error", err.message ?? "Error desconocido");
    } finally {
      setRunning(null);
    }
  };

  return (
    <View style={styles.root}>
      <AppHeader
        title="Simulador"
        subtitle="Triggers de insights"
        left={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
        }
      />
      <ScreenContainer scrollable padded>
        <Text style={styles.info}>
          Ejecuta cada trigger para generar un insight. El proceso tarda ~10–20s
          mientras el webhook llama al Lambda y al modelo ML.
        </Text>

        {triggers.map((trigger) => {
          const status = results[trigger.id];
          const isRunning = running === trigger.id;

          return (
            <Pressable
              key={trigger.id}
              style={[styles.card, isRunning && styles.cardRunning]}
              onPress={() => handleRun(trigger)}
              disabled={isRunning || running !== null}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: trigger.color + "20" },
                ]}
              >
                {isRunning ? (
                  <Ionicons
                    name="hourglass-outline"
                    size={22}
                    color={trigger.color}
                  />
                ) : status === "ok" ? (
                  <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                ) : status === "error" ? (
                  <Ionicons name="close-circle" size={22} color="#ef4444" />
                ) : (
                  <Ionicons
                    name={trigger.icon as any}
                    size={22}
                    color={trigger.color}
                  />
                )}
              </View>

              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{trigger.label}</Text>
                <Text style={styles.cardDesc}>{trigger.description}</Text>
              </View>

              <Ionicons
                name="play-circle-outline"
                size={24}
                color={running !== null ? colors.border : trigger.color}
              />
            </Pressable>
          );
        })}
      </ScreenContainer>
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  info: {
    fontSize: fontSize.sm,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  userIdBox: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  userIdLabel: {
    fontSize: fontSize.xs,
    color: colors.muted,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  userId: {
    fontSize: fontSize.sm,
    color: colors.foreground,
    fontFamily: "monospace",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRunning: {
    opacity: 0.6,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  cardDesc: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginTop: 2,
  },
});
