import { AppCard } from "@/components/AppCard";
import {
    colors,
    fontSize,
    fontWeight,
    spacing
} from "@/constants/design";
import {
    formatCurrency,
    getBuroScoreColor,
    getBuroScoreLevel,
} from "@/services/insightsService";
import { FinancialInsight, INSIGHT_METADATA } from "@/types/insights";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InsightCardProps {
  insight: FinancialInsight;
  onPress?: () => void;
  compact?: boolean;
}

export function InsightCard({
  insight,
  onPress,
  compact = false,
}: InsightCardProps) {
  const metadata = INSIGHT_METADATA[insight.insight_type];
  const scoreColor = getBuroScoreColor(insight.score_buro);
  const scoreLevel = getBuroScoreLevel(insight.score_buro);

  return (
    <AppCard onPress={onPress} style={styles.card} animateIn>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: metadata.color + "20" },
          ]}
        >
          <Ionicons
            name={metadata.icon as any}
            size={20}
            color={metadata.color}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.segmentName}>{insight.segment_name}</Text>
          <Text style={styles.insightTitle}>{metadata.title}</Text>
        </View>
      </View>

      {/* Insight Text */}
      <Text style={styles.insightText} numberOfLines={compact ? 3 : undefined}>
        {insight.insight_text}
      </Text>

      {/* Metrics */}
      {!compact && (
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Score Buró</Text>
            <View style={styles.metricValueRow}>
              <Text style={[styles.metricValue, { color: scoreColor }]}>
                {insight.score_buro}
              </Text>
              <Text style={[styles.metricBadge, { color: scoreColor }]}>
                {scoreLevel}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Gasto Anual</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(insight.gasto_total_anual_mxn)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Uso de Crédito</Text>
            <Text style={styles.metricValue}>
              {insight.utilizacion_credito_pct.toFixed(1)}%
            </Text>
          </View>
        </View>
      )}

      {/* CTA */}
      {onPress && (
        <View style={styles.cta}>
          <Text style={[styles.ctaText, { color: metadata.color }]}>
            Ver detalles
          </Text>
          <Ionicons name="arrow-forward" size={16} color={metadata.color} />
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  segmentName: {
    fontSize: fontSize.xs,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: fontWeight.medium,
  },
  insightTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginTop: 2,
  },
  insightText: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  metrics: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.muted,
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  metricBadge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  ctaText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
