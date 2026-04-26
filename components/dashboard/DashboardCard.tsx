import { AppCard } from "@/components/AppCard";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DashboardCardProps {
  title: string;
  value: string;
  insight: string;
  onPress?: () => void;
  layout?: "side" | "stacked";
  chart?: React.ReactNode;
  meta?: React.ReactNode;
}

export function DashboardCard({
  title,
  value,
  insight,
  onPress,
  layout = "side",
  chart,
  meta,
}: DashboardCardProps) {
  return (
    <AppCard onPress={onPress} style={styles.card} animateIn>
      <View
        style={[
          styles.content,
          layout === "stacked" && styles.contentStacked,
        ]}
      >
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.insight}>{insight}</Text>
          {meta && <View style={styles.meta}>{meta}</View>}
        </View>
        {chart && (
          <View
            style={[
              styles.chart,
              layout === "stacked" && styles.chartStacked,
            ]}
          >
            {chart}
          </View>
        )}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  contentStacked: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.sm,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    fontWeight: fontWeight.medium,
  },
  value: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginTop: spacing.xs,
  },
  insight: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  meta: {
    marginTop: spacing.xs,
  },
  chart: {
    width: 120,
    alignItems: "flex-end",
  },
  chartStacked: {
    width: "100%",
    alignItems: "flex-start",
    marginTop: spacing.md,
  },
});
