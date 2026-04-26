import { colors } from "@/constants/design";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

interface LineMiniProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
}

export function LineMini({
  values,
  width = 160,
  height = 44,
  stroke = colors.foreground,
}: LineMiniProps) {
  if (values.length === 0) {
    return <View style={[styles.empty, { width, height }]} />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  empty: {
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
});
