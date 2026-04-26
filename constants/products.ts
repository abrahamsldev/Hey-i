import { InsightType, SegmentName } from "@/types/insights";

export interface HeyProduct {
  id: string;
  name: string;
  tagline: string;
  detail: string;
  icon: string;
  color: string;
  badge?: string;
}

export const HEY_PRODUCTS: HeyProduct[] = [
  {
    id: "inversion",
    name: "Inversión Hey",
    tagline: "Haz crecer tu dinero",
    detail:
      "Rendimiento anual de hasta 7.50%. Seguro, sencillo y sin mínimos complicados.",
    icon: "trending-up-outline",
    color: "#10b981",
    badge: "7.50% anual",
  },
  {
    id: "ahorro",
    name: "Ahorro Inmediato",
    tagline: "Metas de ahorro con rendimiento",
    detail:
      "Crea metas y gana 4% anual mientras ahorras para lo que más te importa.",
    icon: "wallet-outline",
    color: "#0ea5e9",
    badge: "4% anual",
  },
  {
    id: "acciones",
    name: "Hey Acciones",
    tagline: "Invierte en bolsa desde la app",
    detail:
      "Acciones nacionales e internacionales con comisiones bajas. Diversifica sin complicaciones.",
    icon: "bar-chart-outline",
    color: "#8b5cf6",
  },
  {
    id: "hey_pro",
    name: "Hey Pro",
    tagline: "Beneficios exclusivos para ti",
    detail:
      "Mejores tasas, promociones especiales y ventajas diseñadas para clientes que exigen más.",
    icon: "star-outline",
    color: "#f59e0b",
    badge: "Membresía",
  },
  {
    id: "credito",
    name: "Tarjeta de Crédito Hey",
    tagline: "Sin anualidad, con beneficios",
    detail:
      "Financia tus compras sin pagar anualidad. Versión Garantizada disponible para construir historial.",
    icon: "card-outline",
    color: "#111827",
  },
  {
    id: "credito_negocios",
    name: "Crédito Hey Negocios",
    tagline: "Para emprendedores y empresas",
    detail:
      "Tarjeta diseñada para gastos empresariales. También en versión garantizada.",
    icon: "business-outline",
    color: "#6366f1",
  },
  {
    id: "credito_personal",
    name: "Crédito Personal Hey",
    tagline: "Financia tus proyectos",
    detail:
      "Tasas competitivas y plazos flexibles para lo que necesites, sin trámites complicados.",
    icon: "cash-outline",
    color: "#ef4444",
  },
  {
    id: "proteccion",
    name: "Protección Básica Hey",
    tagline: "Seguro para lo que más importa",
    detail:
      "Vida, robo, fraude, auto, hogar, celular y hospitalización. Todo en un solo lugar.",
    icon: "shield-checkmark-outline",
    color: "#64748b",
  },
  {
    id: "hey_shop",
    name: "Hey Coins & Hey Shop",
    tagline: "Recompensas en cada compra",
    detail:
      "Acumula Hey Coins y úsalos en descuentos y promociones dentro de Hey Shop.",
    icon: "gift-outline",
    color: "#ec4899",
  },
  {
    id: "cuenta_hey",
    name: "Cuenta Hey",
    tagline: "Tu cuenta principal sin comisiones",
    detail:
      "Guarda tu dinero, transfiere sin comisiones y accede a todos los productos de Hey Banco.",
    icon: "home-outline",
    color: "#334155",
  },
  {
    id: "debito",
    name: "Tarjeta de Débito",
    tagline: "Compras y retiros sin costo",
    detail:
      "Asociada a tu Cuenta Hey. Úsala en tiendas físicas, en línea y cajeros sin cargo extra.",
    icon: "phone-portrait-outline",
    color: "#475569",
  },
  {
    id: "credito_auto",
    name: "Crédito de Auto Hey",
    tagline: "Tu próximo auto más cerca",
    detail:
      "Opciones de enganche y plazos adaptados a tu situación. Trámite ágil desde la app.",
    icon: "car-outline",
    color: "#0284c7",
  },
];

/** IDs recomendados por tipo de insight (orden importa: primero = más relevante) */
const RECOMMENDATIONS_BY_INSIGHT: Record<InsightType, string[]> = {
  upsell_investment: ["inversion", "acciones", "hey_pro"],
  upsell_digital: ["hey_pro", "hey_shop", "debito"],
  upsell_business: ["credito_negocios", "credito_personal", "hey_pro"],
  retention_reactivation: ["cuenta_hey", "ahorro", "hey_pro"],
  retention_churn_risk: ["hey_pro", "ahorro", "inversion"],
  loyalty_payroll: ["inversion", "ahorro", "credito"],
  financial_stress_relief: ["credito_personal", "proteccion", "ahorro"],
};

/** IDs recomendados por segmento (fallback si no hay insight_type) */
const RECOMMENDATIONS_BY_SEGMENT: Record<SegmentName, string[]> = {
  "Inversor premium": ["inversion", "acciones", "hey_pro"],
  "Nativo digital": ["hey_pro", "hey_shop", "debito"],
  "Empresario diversificado": [
    "credito_negocios",
    "credito_personal",
    "hey_pro",
  ],
  "Asalariado fiel": ["inversion", "ahorro", "credito"],
  "Estresado financiero": ["credito_personal", "proteccion", "ahorro"],
  "Inactivo en riesgo": ["cuenta_hey", "ahorro", "hey_pro"],
  "Pagador gobierno / Pasivo": ["debito", "ahorro", "inversion"],
};

const DEFAULT_RECOMMENDATIONS = ["cuenta_hey", "inversion", "hey_pro"];

const productMap = new Map(HEY_PRODUCTS.map((p) => [p.id, p]));

export function getRecommendedProducts(
  insightType?: InsightType | null,
  segmentName?: SegmentName | null,
): HeyProduct[] {
  let ids: string[];

  if (insightType && RECOMMENDATIONS_BY_INSIGHT[insightType]) {
    ids = RECOMMENDATIONS_BY_INSIGHT[insightType];
  } else if (segmentName && RECOMMENDATIONS_BY_SEGMENT[segmentName]) {
    ids = RECOMMENDATIONS_BY_SEGMENT[segmentName];
  } else {
    ids = DEFAULT_RECOMMENDATIONS;
  }

  return ids.map((id) => productMap.get(id)!).filter(Boolean);
}

/** Todos los productos excepto los ya recomendados */
export function getOtherProducts(recommendedIds: string[]): HeyProduct[] {
  const set = new Set(recommendedIds);
  return HEY_PRODUCTS.filter((p) => !set.has(p.id));
}
