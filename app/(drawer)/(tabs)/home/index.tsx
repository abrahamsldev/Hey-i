import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { DashboardCard, DonutMini } from "@/components/dashboard";
import { InsightCard } from "@/components/InsightCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from "@/constants/design";
import { getRecommendedProducts, HeyProduct } from "@/constants/products";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, getDashboards } from "@/services/dashboardsService";
import { getPrimaryInsight } from "@/services/insightsService";
import { Dashboard } from "@/types/dashboards";
import { FinancialInsight } from "@/types/insights";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CARDS = [
  {
    id: "products",
    title: "Productos para ti",
    description: "Descubre los productos Hey Banco según tu perfil.",
    icon: "grid-outline",
    route: "/(drawer)/(tabs)/home/products",
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, session } = useAuth();
  const [primaryInsight, setPrimaryInsight] = useState<FinancialInsight | null>(
    null,
  );
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [spendingDashboard, setSpendingDashboard] = useState<Dashboard | null>(
    null,
  );
  const [savingsDashboard, setSavingsDashboard] = useState<Dashboard | null>(
    null,
  );
  const [loadingDashboards, setLoadingDashboards] = useState(true);

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "usuario";

  useEffect(() => {
    if (user?.id) {
      loadInsight();
      loadDashboards();
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
      setRefreshing(false);
    }
  };

  const loadDashboards = async () => {
    try {
      setLoadingDashboards(true);
      const { spending, savings } = await getDashboards(
        session?.access_token ?? "",
      );
      setSpendingDashboard(spending);
      setSavingsDashboard(savings);
    } catch (error) {
      console.error("Error cargando dashboards:", error);
    } finally {
      setLoadingDashboards(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadInsight();
    loadDashboards();
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const widgets = useMemo(() => {
    if (!spendingDashboard || !savingsDashboard) return [];

    const spendingDonut = spendingDashboard.charts.find(
      (chart) => chart.id === "spending_category_donut",
    );

    const donutSeries = spendingDonut?.series?.[0]?.data ?? [];
    const donutTotal = Number(spendingDonut?.summary?.total_mxn ?? 0);
    const donutTopCategory = String(spendingDonut?.summary?.top_category ?? "");

    return [
      {
        id: "financial-health",
        title: "Salud financiera",
        value: formatCurrency(donutTotal, "MXN", 0),
        insight: `Principal gasto: ${donutTopCategory || "-"}`,
        onPress: () => router.push("/(drawer)/(tabs)/home/financial-health"),
        meta: (
          <View style={styles.legend}>
            {donutSeries.map((item, index) => (
              <View
                key={`legend-${item.label ?? index}`}
                style={styles.legendItem}
              >
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor:
                        DONUT_COLORS[index % DONUT_COLORS.length],
                    },
                  ]}
                />
                <Text style={styles.legendLabel} numberOfLines={1}>
                  {String(item.label ?? "")}
                </Text>
              </View>
            ))}
          </View>
        ),
        chart: (
          <DonutMini
            size={92}
            strokeWidth={12}
            data={donutSeries.map((item, index) => ({
              label: String(item.label ?? index),
              value: Number(item.value ?? 0),
              color: DONUT_COLORS[index % DONUT_COLORS.length],
            }))}
          />
        ),
      },
    ];
  }, [router, spendingDashboard, savingsDashboard]);

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
        right={
          <Pressable
            onPress={handleRefresh}
            hitSlop={8}
            disabled={loadingDashboards}
          >
            <Ionicons
              name="refresh-outline"
              size={22}
              color={loadingDashboards ? colors.muted : colors.foreground}
            />
          </Pressable>
        }
      />
      <ScreenContainer
        scrollable
        padded={false}
        style={styles.content}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
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
          <Text style={styles.sectionTitle}>Tu resumen</Text>
          {loadingDashboards && (
            <Text style={styles.loadingText}>Cargando tu resumen...</Text>
          )}
          {!loadingDashboards && widgets.length === 0 && (
            <Text style={styles.loadingText}>Sin datos disponibles aún.</Text>
          )}
          {widgets.map((widget) => (
            <DashboardCard
              key={widget.id}
              title={widget.title}
              value={widget.value}
              insight={widget.insight}
              meta={widget.meta}
              chart={widget.chart}
              onPress={widget.onPress}
            />
          ))}
        </View>

        {/* Productos recomendados — preview */}
        {!loadingInsight && primaryInsight && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Para ti</Text>
              <Pressable
                onPress={() => router.push("/(drawer)/(tabs)/home/products")}
                hitSlop={8}
              >
                <Text style={styles.seeAll}>Ver todos</Text>
              </Pressable>
            </View>
            {getRecommendedProducts(
              primaryInsight.insight_type,
              primaryInsight.segment_name,
            )
              .slice(0, 2)
              .map((product: HeyProduct) => (
                <AppCard
                  key={product.id}
                  onPress={() => router.push("/(drawer)/(tabs)/home/products")}
                  style={styles.productPreviewCard}
                >
                  <View style={styles.productPreviewRow}>
                    <View
                      style={[
                        styles.productPreviewIcon,
                        { backgroundColor: product.color + "18" },
                      ]}
                    >
                      <Ionicons
                        name={product.icon as any}
                        size={20}
                        color={product.color}
                      />
                    </View>
                    <View style={styles.productPreviewInfo}>
                      <Text style={styles.productPreviewName}>
                        {product.name}
                      </Text>
                      <Text style={styles.productPreviewTagline}>
                        {product.tagline}
                      </Text>
                    </View>
                    {product.badge && (
                      <View
                        style={[
                          styles.productBadge,
                          { backgroundColor: product.color + "18" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.productBadgeText,
                            { color: product.color },
                          ]}
                        >
                          {product.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                </AppCard>
              ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorar</Text>
          {CARDS.map((card) => (
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

const DONUT_COLORS = ["#111827", "#38bdf8", "#fb7185", "#34d399"];

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
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: fontWeight.medium,
  },
  productPreviewCard: {
    padding: spacing.md,
  },
  productPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  productPreviewIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  productPreviewInfo: {
    flex: 1,
    gap: 2,
  },
  productPreviewName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  productPreviewTagline: {
    fontSize: fontSize.xs,
    color: colors.muted,
  },
  productBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  productBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  loadingText: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  legend: {
    alignItems: "flex-start",
    gap: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: fontSize.xs,
    color: colors.muted,
  },
  legendSmall: {
    alignItems: "flex-start",
    gap: 2,
  },
  legendItemSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  legendLabelSmall: {
    fontSize: fontSize.xs,
    color: colors.muted,
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
