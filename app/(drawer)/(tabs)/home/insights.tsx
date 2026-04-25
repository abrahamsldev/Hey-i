import { AppCard } from "@/components/AppCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function InsightsScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Insights LLM</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScreenContainer scrollable padded>
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Análisis de gastos</Text>
          <Text style={styles.cardBody}>
            Basado en tus movimientos recientes, el modelo detecta un patrón de
            gasto elevado en entretenimiento durante fines de semana.
          </Text>
        </AppCard>
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Oportunidad de ahorro</Text>
          <Text style={styles.cardBody}>
            Si reduces un 15% en gastos no esenciales durante este mes, podrías
            ahorrar aproximadamente $2,400.
          </Text>
        </AppCard>
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Proyección a 3 meses</Text>
          <Text style={styles.cardBody}>
            Con los hábitos actuales, tu balance proyectado en 90 días es
            positivo pero con un margen ajustado.
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
