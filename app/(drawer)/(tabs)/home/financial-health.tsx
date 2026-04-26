import { AppCard } from "@/components/AppCard";
import { BarMini, DonutMini, LineMini } from "@/components/dashboard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import { formatCurrency, getDashboards } from "@/services/dashboardsService";
import { Dashboard } from "@/types/dashboards";

export default function FinancialHealthScreen() {
  const router = useRouter();
  const [spendingDashboard, setSpendingDashboard] = useState<Dashboard | null>(
    null,
  );
  const [savingsDashboard, setSavingsDashboard] = useState<Dashboard | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const { spending, savings } = await getDashboards(
        session?.access_token ?? "",
      );
      setSpendingDashboard(spending);
      setSavingsDashboard(savings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!spendingDashboard || !savingsDashboard) return null;

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
  const donutTotal = Number(spendingDonut?.summary?.total_mxn ?? 0);
  const donutTopCategory = String(spendingDonut?.summary?.top_category ?? "");

  const donutSeries = spendingDonut?.series?.[0]?.data ?? [];
  const lineValues = (spendingLine?.series?.[0]?.data ?? []).map((p) =>
    Number(p.y ?? 0),
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
  const dailyAverage = Number(spendingLine?.summary?.average_daily_mxn ?? 0);
  const investmentTotal = Number(
    investmentGrowth?.summary?.final_cumulative_mxn ?? 0,
  );
  const netLatest = Number(incomeVsSpend?.summary?.latest_month_net_mxn ?? 0);
  const projectionCategory = String(savingsProjection?.summary?.category ?? "");
  const projectedSavings = Number(
    savingsProjection?.summary?.projected_savings_mxn ?? 0,
  );
  const projectionCurrent = Number(
    savingsProjection?.summary?.current_month_spend_mxn ?? 0,
  );
  const projectedSpend = Number(
    savingsProjection?.summary?.projected_spend_mxn ?? 0,
  );
  const investmentCount = Number(
    investmentGrowth?.summary?.investment_tx_count ?? 0,
  );
  const investmentValues = (investmentGrowth?.series?.[0]?.data ?? []).map(
    (p) => Number(p.y ?? 0),
  );
  const merchants = topMerchants?.series?.[0]?.data ?? [];
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
        {loading && <Text>Cargando...</Text>}
        {!loading && (
          <>
            {/* DONA */}
            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>Salud financiera</Text>

              <Text style={styles.value}>
                {formatCurrency(donutTotal, "MXN", 0)}
              </Text>

              <Text style={styles.insight}>
                Principal gasto: {donutTopCategory || "-"}
              </Text>

              <View
                style={{ alignItems: "center", marginVertical: spacing.sm }}
              >
                <DonutMini
                  size={140}
                  strokeWidth={16}
                  data={donutSeries.map((item, index) => ({
                    label: String(item.label ?? index),
                    value: Number(item.value ?? 0),
                    color: DONUT_COLORS[index % DONUT_COLORS.length],
                  }))}
                />
              </View>

              <View style={styles.legend}>
                {donutSeries.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        {
                          backgroundColor:
                            DONUT_COLORS[index % DONUT_COLORS.length],
                        },
                      ]}
                    />
                    <Text style={styles.legendLabel}>{String(item.label)}</Text>
                  </View>
                ))}
              </View>
            </AppCard>

            {/* CASHFLOW */}
            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>Flujo de dinero</Text>

              <View style={styles.cardRow}>
                <View style={styles.textBlock}>
                  <Text style={styles.value}>
                    {formatCurrency(netLatest, "MXN", 0)}
                  </Text>

                  <Text style={styles.insight}>
                    Sobra {formatCurrency(netLatest, "MXN", 0)} este mes
                  </Text>
                </View>

                <View style={styles.chartBlock}>
                  <BarMini
                    orientation="horizontal"
                    width={120}
                    height={60}
                    data={[
                      {
                        label: "Ingreso",
                        value: incomeLatest,
                        color: colors.foreground,
                      },
                      { label: "Gasto", value: spendLatest, color: "#f97316" },
                      { label: "Neto", value: netLatest, color: "#10b981" },
                    ]}
                  />
                </View>
              </View>
            </AppCard>

            {/* TENDENCIA */}
            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>Tendencia de gasto</Text>

              <View style={styles.cardRow}>
                <View style={styles.textBlock}>
                  <Text style={styles.value}>
                    {formatCurrency(donutTotal, "MXN", 0)}
                  </Text>

                  <Text style={styles.insight}>
                    Promedio diario {formatCurrency(dailyAverage, "MXN", 0)}
                  </Text>
                </View>

                <View style={styles.chartBlock}>
                  <LineMini values={lineValues} width={120} height={50} />
                </View>
              </View>
            </AppCard>

            {/* TOP MERCHANT */}
            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>Top comercios</Text>

              <Text style={styles.value}>
                {formatCurrency(topMerchantValue, "MXN", 0)}
              </Text>

              <Text style={styles.insight}>{topMerchantLabel} #1 del mes</Text>

              <View style={{ marginTop: spacing.sm }}>
                {merchants.slice(0, 5).map((item, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.rank}>#{index + 1}</Text>

                    <Text style={styles.merchantLabel} numberOfLines={1}>
                      {item.label}
                    </Text>

                    <Text style={styles.merchantValue}>
                      {formatCurrency(Number(item.value), "MXN", 0)}
                    </Text>
                  </View>
                ))}
              </View>
            </AppCard>

            {/* AHORRO */}
            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>Ahorro potencial</Text>

              <View style={styles.cardRow}>
                <View style={styles.textBlock}>
                  <Text style={styles.value}>
                    {formatCurrency(projectedSavings, "MXN", 0)}
                  </Text>

                  <Text style={styles.insight}>
                    Reducir 10% en {projectionCategory || "categoría"}
                  </Text>
                </View>

                <View style={styles.chartBlock}>
                  <BarMini
                    orientation="horizontal"
                    width={120}
                    height={50}
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
                  />
                </View>
              </View>
            </AppCard>

            {/* INVERSION */}
            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>Inversión acumulada</Text>

              <View style={styles.cardRow}>
                <View style={styles.textBlock}>
                  <Text style={styles.value}>
                    {formatCurrency(investmentTotal, "MXN", 0)}
                  </Text>

                  <Text style={styles.insight}>{investmentCount} aportes</Text>
                </View>

                <View style={styles.chartBlock}>
                  <LineMini values={investmentValues} width={120} height={50} />
                </View>
              </View>
            </AppCard>
          </>
        )}
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
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  textBlock: {
    flex: 1,
  },

  chartBlock: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  value: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: 4,
  },

  insight: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginBottom: spacing.sm,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  rank: {
    width: 24,
    fontSize: fontSize.sm,
    color: colors.muted,
  },

  merchantLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },

  merchantValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
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
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
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
