import { colors, radius, shadow, spacing } from "@/constants/design";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  animateIn?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppCard({
  children,
  onPress,
  style,
  animateIn = true,
}: AppCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(animateIn ? 0 : 1);
  const translateY = useSharedValue(animateIn ? 12 : 0);

  useEffect(() => {
    if (animateIn) {
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
    if (onPress) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  if (!onPress) {
    return (
      <Animated.View style={[animatedStyle, styles.card, style]}>
        {children}
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      style={[animatedStyle, styles.card, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
});
