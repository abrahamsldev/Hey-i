/**
 * Tipos para insights financieros personalizados
 */

export type InsightType =
  | "upsell_investment"
  | "upsell_digital"
  | "upsell_business"
  | "retention_reactivation"
  | "retention_churn_risk"
  | "loyalty_payroll"
  | "financial_stress_relief";

export type SegmentName =
  | "Inversor premium"
  | "Nativo digital"
  | "Empresario diversificado"
  | "Pagador gobierno / Pasivo"
  | "Inactivo en riesgo"
  | "Asalariado fiel"
  | "Estresado financiero";

export interface FinancialInsight {
  user_id: string;
  cluster: number;
  segment_name: SegmentName;
  insight_type: InsightType;
  insight_text: string;
  status: string;
  score_buro: number;
  utilizacion_credito_pct: number;
  gasto_total_anual_mxn: number;
  tasa_fallos_pct: number;
}

/**
 * Metadata de cada tipo de insight
 */
export interface InsightMetadata {
  type: InsightType;
  title: string;
  icon: string;
  color: string;
  category: "upsell" | "retention" | "loyalty" | "financial_health";
}

export const INSIGHT_METADATA: Record<InsightType, InsightMetadata> = {
  upsell_investment: {
    type: "upsell_investment",
    title: "Oportunidad de inversión",
    icon: "trending-up",
    color: "#10b981",
    category: "upsell",
  },
  upsell_digital: {
    type: "upsell_digital",
    title: "Cashback digital",
    icon: "phone-portrait",
    color: "#3b82f6",
    category: "upsell",
  },
  upsell_business: {
    type: "upsell_business",
    title: "Crédito empresarial",
    icon: "business",
    color: "#8b5cf6",
    category: "upsell",
  },
  retention_reactivation: {
    type: "retention_reactivation",
    title: "Te extrañamos",
    icon: "heart",
    color: "#f59e0b",
    category: "retention",
  },
  retention_churn_risk: {
    type: "retention_churn_risk",
    title: "Mejora tu experiencia",
    icon: "warning",
    color: "#ef4444",
    category: "retention",
  },
  loyalty_payroll: {
    type: "loyalty_payroll",
    title: "Beneficios de nómina",
    icon: "wallet",
    color: "#06b6d4",
    category: "loyalty",
  },
  financial_stress_relief: {
    type: "financial_stress_relief",
    title: "Alivio financiero",
    icon: "shield-checkmark",
    color: "#ec4899",
    category: "financial_health",
  },
};
