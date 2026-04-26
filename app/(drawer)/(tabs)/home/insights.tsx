import { InsightCard } from "@/components/InsightCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { getUserInsights } from "@/services/insightsService";
import { FinancialInsight } from "@/types/insights";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function InsightsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadInsights();
    }
  }, [user?.id]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      // En un caso real, esto obtendría múltiples insights del API
      const data = await getUserInsights(user?.id ?? "");
      setInsights(data);
    } catch (error) {
      console.error("Error cargando insights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Para ti</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScreenContainer scrollable padded>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.foreground} />
            <Text style={styles.loadingText}>
              Cargando tus recomendaciones...
            </Text>
          </View>
        ) : insights.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={colors.muted}
            />
            <Text style={styles.emptyTitle}>Todo al día</Text>
            <Text style={styles.emptyText}>
              Cuando detectemos oportunidades para mejorar tus finanzas, las
              verás aquí.
            </Text>
          </View>
        ) : (
          <>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightWrapper}>
                <InsightCard insight={insight} />
              </View>
            ))}
          </>
        )}
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
  insightWrapper: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.muted,
    marginTop: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
});
