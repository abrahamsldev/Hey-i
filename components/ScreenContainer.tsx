import { colors, spacing } from "@/constants/design";
import React from "react";
import { RefreshControl, StyleSheet, View, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  padded?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function ScreenContainer({
  children,
  style,
  scrollable = false,
  padded = true,
  refreshing,
  onRefresh,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const contentStyle = [
    styles.inner,
    padded && styles.padded,
    { paddingBottom: insets.bottom + spacing.lg },
    style,
  ];

  if (scrollable) {
    return (
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={16}
        refreshControl={
          onRefresh !== undefined ? (
            <RefreshControl
              refreshing={refreshing ?? false}
              onRefresh={onRefresh}
              tintColor={colors.foreground}
            />
          ) : undefined
        }
      >
        {children}
      </KeyboardAwareScrollView>
    );
  }

  return <View style={[styles.container, contentStyle]}>{children}</View>;
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
