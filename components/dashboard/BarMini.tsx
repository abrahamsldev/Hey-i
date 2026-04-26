import { colors, fontSize, spacing } from "@/constants/design";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

export type BarMiniDatum = {
  label: string;
  value: number;
  color: string;
};

interface BarMiniProps {
  data: BarMiniDatum[];
  width?: number;
  height?: number;
  orientation?: "vertical" | "horizontal";
  showLegend?: boolean;
}

export function BarMini({
  data,
  width = 160,
  height = 52,
  orientation = "vertical",
  showLegend = false,
}: BarMiniProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  if (data.length === 0) {
    return <View style={[styles.empty, { width, height }]} />;
  }

  const gap = 4;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {data.map((item, index) => {
          if (orientation === "horizontal") {
            const barHeight = (height - gap * (data.length - 1)) / data.length;
            const barWidth = (item.value / max) * width;
            const y = index * (barHeight + gap);
            return (
              <Rect
                key={item.label}
                x={0}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={item.color}
              />
            );
          }

          const barWidth = (width - gap * (data.length - 1)) / data.length;
          const barHeight = (item.value / max) * height;
          const x = index * (barWidth + gap);
          const y = height - barHeight;

          return (
            <Rect
              key={item.label}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={item.color}
            />
          );
        })}
      </Svg>
      {showLegend && (
        <View style={styles.legend}>
          {data.map((item) => (
            <View key={`legend-${item.label}`} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  empty: {
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  legend: {
    alignSelf: "flex-start",
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
});
