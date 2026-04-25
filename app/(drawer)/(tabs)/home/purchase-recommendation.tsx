import { AppCard } from "@/components/AppCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PurchaseRecommendationScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Recomendación de compra</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScreenContainer scrollable padded>
        <AppCard style={styles.card}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Recomendado</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>Fondo de inversión indexado</Text>
          <Text style={styles.cardBody}>
            Ideal para tu perfil de riesgo moderado. Rendimiento histórico anual
            promedio del 8.5%.
          </Text>
        </AppCard>
        <AppCard style={styles.card}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Bajo riesgo</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>CETES 28 días</Text>
          <Text style={styles.cardBody}>
            Tasa actual competitiva con liquidez semanal. Apropiado para
            reservas de emergencia.
          </Text>
        </AppCard>
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
  card: {
    marginBottom: spacing.md,
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.foreground,
    borderRadius: 99,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  cardBody: {
    fontSize: fontSize.sm,
    color: colors.muted,
    lineHeight: 20,
  },
});
