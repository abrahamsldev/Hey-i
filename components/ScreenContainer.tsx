import { colors, spacing } from "@/constants/design";
import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  padded?: boolean;
}

export function ScreenContainer({
  children,
  style,
  scrollable = false,
  padded = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const inner = [
    styles.inner,
    padded && styles.padded,
    { paddingBottom: insets.bottom + spacing.lg },
    style,
  ];

  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={inner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.container, inner]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flexGrow: 1,
  },
  padded: {
    padding: spacing.lg,
  },
});
