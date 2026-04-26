import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import {
  BarMini,
  DashboardCard,
  DonutMini,
  LineMini,
} from "@/components/dashboard";
import { InsightCard } from "@/components/InsightCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, getDashboards } from "@/services/dashboardsService";
import { getPrimaryInsight } from "@/services/insightsService";
import { Dashboard } from "@/types/dashboards";
import { FinancialInsight } from "@/types/insights";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  const [spendingDashboard, setSpendingDashboard] =
    useState<Dashboard | null>(null);
  const [savingsDashboard, setSavingsDashboard] =
    useState<Dashboard | null>(null);
  const [loadingDashboards, setLoadingDashboards] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    }
  };

  const loadDashboards = async () => {
    try {
      setLoadingDashboards(true);
      const { spending, savings } = await getDashboards();
      setSpendingDashboard(spending);
      setSavingsDashboard(savings);
    } catch (error) {
      console.error("Error cargando dashboards:", error);
    } finally {
      setLoadingDashboards(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboards();
    setRefreshing(false);
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const widgets = useMemo(() => {
    if (!spendingDashboard || !savingsDashboard) return [];

    const spendingDonut = spendingDashboard.charts.find(
      (chart) => chart.id === "spending_category_donut",
    );
    const spendingLine = spendingDashboard.charts.find(
      (chart) => chart.id === "spending_daily_last_30_days",
    );
    const topMerchants = spendingDashboard.charts.find(
      (chart) => chart.id === "spending_top_merchants",
    );
    const incomeVsSpend = savingsDashboard.charts.find(
      (chart) => chart.id === "savings_income_vs_spend",
    );
    const savingsProjection = savingsDashboard.charts.find(
      (chart) => chart.id === "savings_projection",
    );
    const investmentGrowth = savingsDashboard.charts.find(
      (chart) => chart.id === "savings_investment_growth",
    );

    const donutSeries = spendingDonut?.series?.[0]?.data ?? [];
    const donutTotal = Number(spendingDonut?.summary?.total_mxn ?? 0);
    const donutTopCategory = String(
      spendingDonut?.summary?.top_category ?? "",
    );

    const lineValues = (spendingLine?.series?.[0]?.data ?? []).map(
      (point) => Number(point.y ?? 0),
    );
    const dailyAverage = Number(
      spendingLine?.summary?.average_daily_mxn ?? 0,
    );

    const merchantTop = topMerchants?.series?.[0]?.data?.[0];
    const topMerchantLabel = String(merchantTop?.label ?? "");
    const topMerchantValue = Number(merchantTop?.value ?? 0);

    const incomeLatest = Number(
      incomeVsSpend?.summary?.latest_month_income_mxn ?? 0,
    );
    const spendLatest = Number(
      incomeVsSpend?.summary?.latest_month_spend_mxn ?? 0,
    );
    const netLatest = Number(
      incomeVsSpend?.summary?.latest_month_net_mxn ?? 0,
    );

    const projectionCategory = String(
      savingsProjection?.summary?.category ?? "",
    );
    const projectedSavings = Number(
      savingsProjection?.summary?.projected_savings_mxn ?? 0,
    );
    const projectedSpend = Number(
      savingsProjection?.summary?.projected_spend_mxn ?? 0,
    );
    const projectionCurrent = Number(
      savingsProjection?.summary?.current_month_spend_mxn ?? 0,
    );

    const investmentTotal = Number(
      investmentGrowth?.summary?.final_cumulative_mxn ?? 0,
    );
    const investmentCount = Number(
      investmentGrowth?.summary?.investment_tx_count ?? 0,
    );
    const investmentValues = (investmentGrowth?.series?.[0]?.data ?? []).map(
      (point) => Number(point.y ?? 0),
    );

    return [
      {
        id: "monthly-spend",
        title: "Gasto del mes",
        value: formatCurrency(donutTotal, "MXN", 0),
        insight: `Top categoria: ${donutTopCategory || "-"}`,
        onPress: () =>
          router.push("/(drawer)/(tabs)/home/financial-health"),
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
                    { backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] },
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
      {
        id: "cashflow",
        title: "Flujo de dinero",
        value: formatCurrency(netLatest, "MXN", 0),
        insight: `Sobra ${formatCurrency(netLatest, "MXN", 0)} este mes`,
        onPress: () =>
          router.push("/(drawer)/(tabs)/home/financial-health"),
        meta: (
          <View style={styles.legendSmall}>
            {[
              { label: "Ingreso", color: colors.foreground },
              { label: "Gasto", color: "#f97316" },
              { label: "Neto", color: "#10b981" },
            ].map((item) => (
              <View key={`legend-${item.label}`} style={styles.legendItemSmall}>
                <View
                  style={[styles.legendDotSmall, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendLabelSmall} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        ),
        chart: (
          <BarMini
            orientation="horizontal"
            width={140}
            height={64}
            data={[
              {
                label: "Ingreso",
                value: incomeLatest,
                color: colors.foreground,
              },
              {
                label: "Gasto",
                value: spendLatest,
                color: "#f97316",
              },
              {
                label: "Neto",
                value: netLatest,
                color: "#10b981",
              },
            ]}
          />
        ),
      },
      {
        id: "spend-trend",
        title: "Tendencia de gasto",
        value: formatCurrency(donutTotal, "MXN", 0),
        insight: `Promedio diario ${formatCurrency(dailyAverage, "MXN", 0)}`,
        onPress: () => router.push("/(drawer)/(tabs)/home/insights"),
        layout: "stacked" as const,
        chart: <LineMini values={lineValues} width={240} height={56} />,
      },
      {
        id: "top-merchant",
        title: "Top comercio",
        value: formatCurrency(topMerchantValue, "MXN", 0),
        insight: topMerchantLabel ? `${topMerchantLabel} #1 del mes` : "#1 del mes",
        onPress: () => router.push("/(drawer)/(tabs)/home/insights"),
        chart: (
          <BarMini
            orientation="horizontal"
            data={[
              {
                label: topMerchantLabel || "Top",
                value: topMerchantValue,
                color: colors.foreground,
              },
            ]}
            width={120}
            height={40}
          />
        ),
      },
      {
        id: "savings",
        title: "Ahorro potencial",
        value: formatCurrency(projectedSavings, "MXN", 0),
        insight: `Reducir 10% en ${projectionCategory || "categoria"}`,
        onPress: () =>
          router.push("/(drawer)/(tabs)/home/purchase-recommendation"),
        chart: (
          <BarMini
            orientation="horizontal"
            showLegend
            data={[
              {
                label: "Actual",
                value: projectionCurrent,
                color: colors.foreground,
              },
              {
                label: "Proyectado",
                value: projectedSpend,
                color: "#10b981",
              },
            ]}
            width={120}
            height={52}
          />
        ),
      },
      {
        id: "investment",
        title: "Inversion acumulada",
        value: formatCurrency(investmentTotal, "MXN", 0),
        insight: `${investmentCount} aportes`,
        onPress: () =>
          router.push("/(drawer)/(tabs)/home/purchase-recommendation"),
        chart: <LineMini values={investmentValues} width={140} height={44} />,
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
      />
      <ScreenContainer
        scrollable
        padded={false}
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.foreground}
          />
        }
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
            <Text style={styles.loadingText}>Cargando dashboards...</Text>
          )}
          {!loadingDashboards && widgets.length === 0 && (
            <Text style={styles.loadingText}>
              Aun no hay datos disponibles.
            </Text>
          )}
          {widgets.map((widget) => (
            <DashboardCard
              key={widget.id}
              title={widget.title}
              value={widget.value}
              insight={widget.insight}
              meta={widget.meta}
              chart={widget.chart}
              layout={widget.layout}
              onPress={widget.onPress}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {primaryInsight ? "Explorar más" : "Tu resumen"}
          </Text>
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
  loadingText: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.md,
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
