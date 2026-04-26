export type ValueFormat = {
  kind: "currency";
  currency: string;
  decimals: number;
};

export type ChartPoint = {
  label?: string;
  value?: number;
  count?: number;
  share_pct?: number;
  average_ticket_mxn?: number;
  x?: string;
  y?: number;
};

export type ChartSeries = {
  name: string;
  data: ChartPoint[];
};

export type ChartSummary = Record<string, number | string | null>;

export type DashboardChart = {
  id: string;
  type: "donut" | "bar" | "line" | "heatmap";
  title: string;
  subtitle?: string;
  available: boolean;
  unit?: string;
  value_format?: ValueFormat;
  series?: ChartSeries[];
  categories?: string[];
  orientation?: "vertical" | "horizontal";
  summary?: ChartSummary;
  meta?: Record<string, unknown>;
  notes?: string[];
  points?: Array<{
    day_of_week: string;
    day_index: number;
    hour: number;
    value: number;
  }>;
};

export type DashboardSummary = Record<string, number | string | null>;

export type Dashboard = {
  ok: boolean;
  dashboard: "spending_dashboard" | "savings_dashboard";
  user_id: string;
  generated_at: string;
  charts: DashboardChart[];
  summary: DashboardSummary;
  warnings: string[];
  errors: string[];
  meta: Record<string, unknown>;
};

export type DashboardResponse = {
  structuredContent: Dashboard;
  isError: boolean;
};

export function getChartById(
  dashboard: Dashboard | null,
  chartId: string,
): DashboardChart | null {
  if (!dashboard) return null;
  return dashboard.charts.find((chart) => chart.id === chartId) ?? null;
}
