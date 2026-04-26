import { AppCard } from "@/components/AppCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
    colors,
    fontSize,
    fontWeight,
    radius,
    spacing,
} from "@/constants/design";
import { HEY_PRODUCTS, HeyProduct } from "@/constants/products";
import { useAuth } from "@/context/AuthContext";
import {
    getAgentProductRecommendations,
    ProductId,
} from "@/services/chatService";
import { getUserSegment } from "@/services/userProfileService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const productMap = new Map(HEY_PRODUCTS.map((p) => [p.id, p]));

function ProductCard({
  product,
  highlighted,
}: {
  product: HeyProduct;
  highlighted?: boolean;
}) {
  return (
    <AppCard style={styles.productCard} animateIn={false}>
      <View style={styles.productRow}>
        <View
          style={[
            styles.productIcon,
            { backgroundColor: product.color + "18" },
          ]}
        >
          <Ionicons
            name={product.icon as any}
            size={22}
            color={product.color}
          />
        </View>
        <View style={styles.productInfo}>
          <View style={styles.productNameRow}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.badge && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: product.color + "18" },
                ]}
              >
                <Text style={[styles.badgeText, { color: product.color }]}>
                  {product.badge}
                </Text>
              </View>
            )}
            {highlighted && (
              <View style={styles.aiTag}>
                <Ionicons name="sparkles" size={11} color="#f59e0b" />
                <Text style={styles.aiTagText}>Recomendado</Text>
              </View>
            )}
          </View>
          <Text style={styles.productTagline}>{product.tagline}</Text>
          <Text style={styles.productDetail}>{product.detail}</Text>
        </View>
      </View>
    </AppCard>
  );
}

export default function ProductsScreen() {
  const router = useRouter();
  const { user, session } = useAuth();
  const [recommendedIds, setRecommendedIds] = useState<ProductId[]>([]);
  const [segmentName, setSegmentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [agentError, setAgentError] = useState(false);

  const load = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id || !session?.access_token) return;
      setAgentError(false);
      try {
        const [ids, segmentData] = await Promise.all([
          getAgentProductRecommendations(
            session.access_token,
            user.id,
            forceRefresh,
          ).catch(() => {
            setAgentError(true);
            return [] as ProductId[];
          }),
          getUserSegment(user.id).catch(() => null),
        ]);
        setRecommendedIds(ids);
        setSegmentName(segmentData?.segmento ?? null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id, session?.access_token],
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load(true); // fuerza nueva consulta al agente
  };

  const recommended = recommendedIds
    .map((id) => productMap.get(id))
    .filter((p): p is HeyProduct => !!p);

  const recommendedSet = new Set(recommendedIds);
  const others = HEY_PRODUCTS.filter(
    (p) => !recommendedSet.has(p.id as ProductId),
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Productos Hey Banco</Text>
        <Pressable
          onPress={handleRefresh}
          hitSlop={8}
          disabled={loading || refreshing}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color={loading || refreshing ? colors.muted : colors.foreground}
          />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.foreground} />
          <Text style={styles.loadingText}>Analizando tu perfil...</Text>
        </View>
      ) : (
        <ScreenContainer
          scrollable
          padded
          refreshing={refreshing}
          onRefresh={handleRefresh}
        >
          {/* Segmento badge */}
          {segmentName && (
            <View style={styles.segmentRow}>
              <Ionicons
                name="person-circle-outline"
                size={16}
                color={colors.muted}
              />
              <Text style={styles.segmentText}>
                Perfil detectado:{" "}
                <Text style={styles.segmentName}>{segmentName}</Text>
              </Text>
            </View>
          )}

          {/* Error del agente — muestra todos los productos sin sección "Para ti" */}
          {agentError && (
            <View style={styles.errorRow}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.muted}
              />
              <Text style={styles.errorText}>
                No se pudo personalizar. Mostrando catálogo completo.
              </Text>
            </View>
          )}

          {/* Recomendados por el agente */}
          {recommended.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Para ti</Text>
                <View style={styles.aiLabel}>
                  <Ionicons name="sparkles" size={12} color="#f59e0b" />
                  <Text style={styles.aiLabelText}>Personalizado con IA</Text>
                </View>
              </View>
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} highlighted />
              ))}
            </>
          )}

          {/* Resto del catálogo */}
          <Text
            style={[
              styles.sectionTitle,
              recommended.length > 0 && { marginTop: spacing.lg },
            ]}
          >
            {recommended.length > 0 ? "Más productos" : "Todos los productos"}
          </Text>
          {(agentError ? HEY_PRODUCTS : others).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScreenContainer>
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  segmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.md,
  },
  segmentText: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  segmentName: {
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.muted,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  aiLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  aiLabelText: {
    fontSize: fontSize.xs,
    color: "#f59e0b",
    fontWeight: fontWeight.medium,
  },
  productCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  productRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  productIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  productInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  productNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  productName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#fef3c7",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  aiTagText: {
    fontSize: fontSize.xs,
    color: "#f59e0b",
    fontWeight: fontWeight.semibold,
  },
  productTagline: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.muted,
  },
  productDetail: {
    fontSize: fontSize.sm,
    color: colors.muted,
    lineHeight: 19,
  },
});
