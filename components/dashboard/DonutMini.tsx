import { colors } from "@/constants/design";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

export type DonutDatum = {
  label: string;
  value: number;
  color: string;
};

interface DonutMiniProps {
  data: DonutDatum[];
  size?: number;
  strokeWidth?: number;
}

const DEFAULT_SIZE = 72;
const DEFAULT_STROKE = 10;

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) => {
  const angleRad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
};

export function DonutMini({
  data,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE,
}: DonutMiniProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const gap = 2;
  let currentAngle = 0;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {total > 0 && (
          <G>
            {data.map((item) => {
              const slice = (item.value / total) * 360;
              const startAngle = currentAngle + gap;
              const endAngle = currentAngle + slice - gap;
              currentAngle += slice;

              if (endAngle <= startAngle) return null;

              return (
                <Path
                  key={item.label}
                  d={describeArc(center, center, radius, startAngle, endAngle)}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
