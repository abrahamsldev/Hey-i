import {
    colors,
    fontSize,
    fontWeight,
    radius,
    spacing,
} from "@/constants/design";
import * as Haptics from "expo-haptics";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({
  label,
  onPress,
  variant = "primary",
  loading = false,
  style,
  textStyle,
  disabled = false,
}: AppButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const containerStyle = [
    styles.base,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "ghost" && styles.ghost,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const lblStyle = [
    styles.label,
    variant === "primary" && styles.labelPrimary,
    variant === "secondary" && styles.labelSecondary,
    variant === "ghost" && styles.labelGhost,
    textStyle,
  ];

  return (
    <AnimatedPressable
      style={[animatedStyle, containerStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.background : colors.foreground}
        />
      ) : (
        <Text style={lblStyle}>{label}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  primary: {
    backgroundColor: colors.foreground,
  },
  secondary: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.foreground,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  labelPrimary: {
    color: colors.background,
  },
  labelSecondary: {
    color: colors.foreground,
  },
  labelGhost: {
    color: colors.muted,
  },
});
