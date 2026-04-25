import { colors, fontWeight } from "@/constants/design";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface ProfileAvatarProps {
  name?: string | null;
  size?: number;
  style?: ViewStyle;
}

export function ProfileAvatar({ name, size = 72, style }: ProfileAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("")
    : "?";

  const fontSize_ = size * 0.38;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: fontSize_ }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.background,
    fontWeight: fontWeight.bold,
  },
});
