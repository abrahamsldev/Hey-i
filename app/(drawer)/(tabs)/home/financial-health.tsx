import { AppCard } from "@/components/AppCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const METRICS = [
  {
    label: "Ingresos mensuales",
    value: "$18,500",
    icon: "trending-up-outline",
  },
  { label: "Gastos totales", value: "$12,300", icon: "trending-down-outline" },
  { label: "Ahorro neto", value: "$6,200", icon: "wallet-outline" },
  { label: "Deuda activa", value: "$0", icon: "shield-checkmark-outline" },
];

export default function FinancialHealthScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Salud financiera</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScreenContainer scrollable padded>
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Score actual</Text>
          <Text style={styles.score}>82</Text>
          <Text style={styles.scoreDesc}>Bueno · Sigue así</Text>
        </View>

        {METRICS.map((m) => (
          <AppCard key={m.label} style={styles.card}>
            <View style={styles.metricRow}>
              <Ionicons
                name={m.icon as any}
                size={22}
                color={colors.foreground}
              />
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={styles.metricValue}>{m.value}</Text>
              </View>
            </View>
          </AppCard>
        ))}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  scoreSection: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  scoreLabel: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  score: {
    fontSize: 72,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    lineHeight: 80,
  },
  scoreDesc: {
    fontSize: fontSize.md,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  card: {
    marginBottom: spacing.md,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  metricText: {
    flex: 1,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginTop: 2,
  },
});
