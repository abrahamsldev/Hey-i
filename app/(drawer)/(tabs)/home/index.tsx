import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { InsightCard } from "@/components/InsightCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { getPrimaryInsight } from "@/services/insightsService";
import { FinancialInsight } from "@/types/insights";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CARDS = [
  {
    id: "purchase",
    title: "Recomendación de compra",
    description: "Analiza tus hábitos y sugiere oportunidades.",
    icon: "cart-outline",
    route: "/(drawer)/(tabs)/home/purchase-recommendation",
  },
  {
    id: "health",
    title: "Salud financiera",
    description: "Visualiza el estado general de tus finanzas.",
    icon: "pulse-outline",
    route: "/(drawer)/(tabs)/home/financial-health",
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [primaryInsight, setPrimaryInsight] = useState<FinancialInsight | null>(
    null,
  );
  const [loadingInsight, setLoadingInsight] = useState(true);

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "usuario";

  useEffect(() => {
    if (user?.id) {
      loadInsight();
    }
  }, [user?.id]);

  const loadInsight = async () => {
    try {
      setLoadingInsight(true);
      const insight = await getPrimaryInsight(user?.id ?? "");
      setPrimaryInsight(insight);
    } catch (error) {
      console.error("Error cargando insight:", error);
    } finally {
      setLoadingInsight(false);
    }
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.root}>
      <AppHeader
        title="Hey!i"
        subtitle={`Hola, ${displayName}`}
        left={
          <Pressable onPress={openDrawer} hitSlop={8}>
            <Ionicons name="menu-outline" size={26} color={colors.foreground} />
          </Pressable>
        }
      />
      <ScreenContainer scrollable padded={false} style={styles.content}>
        {/* Insight Principal */}
        {!loadingInsight && primaryInsight && (
          <View style={styles.insightSection}>
            <InsightCard
              insight={primaryInsight}
              compact
              onPress={() => router.push("/(drawer)/(tabs)/home/insights")}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {primaryInsight ? "Explorar más" : "Tu resumen"}
          </Text>
          {CARDS.map((card, index) => (
            <AppCard
              key={card.id}
              onPress={() => router.push(card.route as any)}
              style={{ marginBottom: spacing.md }}
            >
              <View style={styles.cardRow}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={card.icon as any}
                    size={24}
                    color={colors.foreground}
                  />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.placeholder}
                />
              </View>
            </AppCard>
          ))}
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  insightSection: {
    marginBottom: spacing.lg,
  },
  section: {
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.inputBackground,
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
  cardDescription: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginTop: 2,
  },
});
