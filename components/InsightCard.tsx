import { AppCard } from "@/components/AppCard";
import {
    colors,
    fontSize,
    fontWeight,
    radius,
    spacing,
} from "@/constants/design";
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
        <Text style={styles.insightTitle}>{metadata.title}</Text>
      </View>

      {/* Mensaje */}
      <Text style={styles.insightText} numberOfLines={compact ? 3 : undefined}>
        {insight.insight_text}
      </Text>

      {/* CTA */}
      {onPress && (
        <View style={[styles.ctaButton, { backgroundColor: metadata.color }]}>
          <Text style={styles.ctaLabel}>{metadata.cta_label}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
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
  insightTitle: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  insightText: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.foreground,
    marginBottom: spacing.lg,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  ctaLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: "#fff",
  },
});
