import { colors, fontSize, radius, spacing } from "@/constants/design";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    TextInput,
    View
} from "react-native";

interface TextInputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TextInputBar({
  onSend,
  disabled,
  placeholder = "Escribe un mensaje...",
}: TextInputBarProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        multiline
        maxLength={1000}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        editable={!disabled}
      />
      <Pressable
        style={[
          styles.sendButton,
          (!text.trim() || disabled) && styles.sendDisabled,
        ]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <Ionicons name="arrow-up" size={20} color={colors.background} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    color: colors.foreground,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: {
    backgroundColor: colors.border,
  },
});
