# Sistema de Insights Financieros

Sistema completo para mostrar insights personalizados generados por IA basados en el perfil financiero del usuario.

## Estructura de Datos

Cada insight contiene:

- **Segmentación**: cluster, segment_name (ej: "Inversor premium", "Nativo digital")
- **Tipo**: insight_type (upsell, retention, loyalty, financial_health)
- **Contenido**: insight_text (texto personalizado generado)
- **Métricas**: score_buro, utilizacion_credito_pct, gasto_total_anual_mxn, tasa_fallos_pct

## Archivos Creados

### 1. Tipos TypeScript

**Archivo**: [`types/insights.ts`](../types/insights.ts)

Define:

- `InsightType`: 7 tipos de insights
- `SegmentName`: 7 segmentos de usuarios
- `FinancialInsight`: Interface completa
- `INSIGHT_METADATA`: Metadata visual de cada tipo (color, icono, título)

### 2. Servicio de Insights

**Archivo**: [`services/insightsService.ts`](../services/insightsService.ts)

Funciones:

- `getUserInsights(userId)`: Obtiene todos los insights del usuario
- `getPrimaryInsight(userId)`: Obtiene el insight principal para Home
- `formatCurrency(amount)`: Formatea moneda MXN
- `getBuroScoreColor(score)`: Color según score de buró
- `getBuroScoreLevel(score)`: Nivel del score (Excelente/Bueno/Regular/Necesita atención)

**Mock Data**: Actualmente usa datos de ejemplo. Al conectar el API real, solo se necesita cambiar estas funciones.

### 3. Componente InsightCard

**Archivo**: [`components/InsightCard.tsx`](../components/InsightCard.tsx)

Componente visual reutilizable que muestra:

- Header con icono y tipo de insight
- Texto del insight personalizado
- Métricas clave (Score Buró, Gasto Anual, Uso de Crédito)
- CTA opcional
- Modo compacto para vista previa

### 4. Pantalla Home (Actualizada)

**Archivo**: [`app/(drawer)/(tabs)/home/index.tsx`](<../app/(drawer)/(tabs)/home/index.tsx>)

Cambios

- Carga y muestra el insight principal del día
- Vista compacta del insight en la parte superior
- Sección "Tu resumen" movida debajo del insight

### 5. Pantalla Insights (Rediseñada)

**Archivo**: [`app/(drawer)/(tabs)/home/insights.tsx`](<../app/(drawer)/(tabs)/home/insights.tsx>)

Features:

- Muestra todos los insights del usuario
- Loading state con mensaje personalizado
- Empty state si no hay insights
- Muestra el segmento del usuario
- Info box explicando cómo se generan los insights

## Tipos de Insights

### 1. **Upsell**

- `upsell_investment`: Oportunidades de inversión
- `upsell_digital`: Cashback en servicios digitales
- `upsell_business`: Crédito empresarial

### 2. **Retention**

- `retention_reactivation`: Reactivación de usuarios inactivos
- `retention_churn_risk`: Prevención de churn

### 3. **Loyalty**

- `loyalty_payroll`: Beneficios de nómina

### 4. **Financial Health**

- `financial_stress_relief`: Alivio financiero

## Segmentos de Usuarios

1. **Inversor premium** (Cluster 0)
2. **Nativo digital** (Cluster 1)
3. **Pagador gobierno / Pasivo** (Cluster 2)
4. **Asalariado fiel** (Cluster 3)
5. **Empresario diversificado** (Cluster 4)
6. **Inactivo en riesgo** (Cluster 5)
7. **Estresado financiero** (Cluster 6)

## Uso en Componentes

### Mostrar insight en Home

```tsx
import { getPrimaryInsight } from "@/services/insightsService";
import { InsightCard } from "@/components/InsightCard";

function MyComponent() {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    getPrimaryInsight(userId).then(setInsight);
  }, [userId]);

  return insight ? (
    <InsightCard
      insight={insight}
      compact
      onPress={() => navigate("/insights")}
    />
  ) : null;
}
```

### Mostrar todos los insights

```tsx
import { getUserInsights } from "@/services/insightsService";
import { InsightCard } from "@/components/InsightCard";

function InsightsPage() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    getUserInsights(userId).then(setInsights);
  }, [userId]);

  return insights.map((insight) => (
    <InsightCard key={insight.user_id} insight={insight} />
  ));
}
```

## Integración con el API Real

Cuando el API esté disponible, actualizar `services/insightsService.ts`:

```typescript
import { supabase } from "@/lib/supabase";

export async function getUserInsights(
  userId: string,
): Promise<FinancialInsight[]> {
  const { data, error } = await supabase
    .from("user_insights") // o tu tabla correspondiente
    .select("*")
    .eq("user_id", userId)
    .eq("status", "ok")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// O llamar directamente al API endpoint
export async function getUserInsights(
  userId: string,
): Promise<FinancialInsight[]> {
  const response = await fetch(`${API_URL}/insights?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch insights");
  return response.json();
}
```

## Personalización Visual

Cada tipo de insight tiene su propia identidad visual definida en `INSIGHT_METADATA`:

```typescript
{
  type: "upsell_investment",
  title: "Oportunidad de inversión",
  icon: "trending-up",
  color: "#10b981", // Verde
  category: "upsell",
}
```

Para cambiar colores o iconos, editar `types/insights.ts`.

## Métricas Mostradas

El `InsightCard` muestra tres métricas principales:

1. **Score Buró**: Con color dinámico según nivel
   - 750+: Verde (Excelente)
   - 650-749: Azul (Bueno)
   - 550-649: Amarillo (Regular)
   - <550: Rojo (Necesita atención)

2. **Gasto Anual**: Formateado como MXN

3. **Uso de Crédito**: Porcentaje con 1 decimal

## Testing con Mock Data

El sistema actualmente usa mock data con 8 ejemplos reales de cada segmento. Cada vez que se carga, devuelve un insight aleatorio para simular variabilidad.

Para cambiar el comportamiento del mock:

- Editar `MOCK_INSIGHTS` en `services/insightsService.ts`
- Agregar más ejemplos o cambiar la lógica de selección

## Próximos Pasos

1. ✅ Conectar con API real cuando esté disponible
2. ✅ Agregar analytics para tracking de clics en insights
3. ✅ Implementar acciones específicas por tipo de insight
4. ✅ Agregar notificaciones push para insights importantes
5. ✅ Crear historial de insights vistos/descartados
6. ✅ A/B testing de diferentes formatos de insights
