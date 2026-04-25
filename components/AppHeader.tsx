import { colors, fontSize, fontWeight, spacing } from "@/constants/design";
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ViewStyle
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  style?: ViewStyle;
  transparent?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  right,
  left,
  style,
  transparent,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm },
        transparent && styles.transparent,
        style,
      ]}
    >
      <View style={styles.row}>
        {left && <View style={styles.side}>{left}</View>}
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {right && <View style={[styles.side, styles.sideRight]}>{right}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transparent: {
    borderBottomWidth: 0,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  center: {
    flex: 1,
  },
  side: {
    minWidth: 40,
  },
  sideRight: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginTop: 2,
  },
});
