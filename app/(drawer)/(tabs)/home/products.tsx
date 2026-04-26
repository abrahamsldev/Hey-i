import { AppCard } from "@/components/AppCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
    colors,
    fontSize,
    fontWeight,
    radius,
    spacing,
} from "@/constants/design";
import {
    getOtherProducts,
    getRecommendedProducts,
    HeyProduct,
} from "@/constants/products";
import { useAuth } from "@/context/AuthContext";
import { getPrimaryInsight } from "@/services/insightsService";
import { getUserSegment } from "@/services/userProfileService";
import { FinancialInsight, SegmentName } from "@/types/insights";
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

function ProductCard({ product }: { product: HeyProduct }) {
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
  const { user } = useAuth();
  const [insight, setInsight] = useState<FinancialInsight | null>(null);
  const [segmentName, setSegmentName] = useState<SegmentName | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [insightData, segmentData] = await Promise.all([
        getPrimaryInsight(user.id).catch(() => null),
        getUserSegment(user.id).catch(() => null),
      ]);
      setInsight(insightData);
      setSegmentName((segmentData?.segmento as SegmentName) ?? null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load();
  };

  // Segmento de user_segments es la fuente de verdad; insight_type refina la recomendación
  const recommended = getRecommendedProducts(
    insight?.insight_type ?? null,
    segmentName,
  );
  const others = getOtherProducts(recommended.map((p) => p.id));

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
                Recomendaciones para tu perfil:{" "}
                <Text style={styles.segmentName}>{segmentName}</Text>
              </Text>
            </View>
          )}

          {/* Recomendados */}
          <Text style={styles.sectionTitle}>Para ti</Text>
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* Todos los demás */}
          <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
            Más productos
          </Text>
          {others.map((product) => (
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
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.md,
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
