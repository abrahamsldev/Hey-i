import { colors, fontSize, radius, spacing } from "@/constants/design";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export function ChatBubble({ role, content, isLoading }: ChatBubbleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const isUser = role === "user";

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.wrapper,
        isUser ? styles.wrapperUser : styles.wrapperAssistant,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        {isLoading ? (
          <View style={styles.dotsRow}>
            <Dot delay={0} />
            <Dot delay={200} />
            <Dot delay={400} />
          </View>
        ) : isUser ? (
          <Text style={[styles.text, styles.textUser]}>{content}</Text>
        ) : (
          <Markdown style={markdownStyles}>{content}</Markdown>
        )}
      </View>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      opacity.value = withTiming(1, { duration: 400 }, () => {
        opacity.value = withTiming(0.3, { duration: 400 });
      });
    };
    const timeout = setTimeout(animate, delay);
    return () => clearTimeout(timeout);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.xs,
    maxWidth: "80%",
  },
  wrapperUser: {
    alignSelf: "flex-end",
  },
  wrapperAssistant: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  bubbleUser: {
    backgroundColor: colors.foreground,
  },
  bubbleAssistant: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  textUser: {
    color: colors.background,
  },
  textAssistant: {
    color: colors.foreground,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    height: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 9999,
    backgroundColor: colors.muted,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: colors.foreground,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: spacing.xs,
  },
  heading1: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.foreground,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  heading2: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.foreground,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  heading3: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.foreground,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  strong: {
    fontWeight: "700",
    color: colors.foreground,
  },
  em: {
    fontStyle: "italic",
  },
  hr: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.sm,
  },
  bullet_list: {
    marginBottom: spacing.xs,
  },
  ordered_list: {
    marginBottom: spacing.xs,
  },
  list_item: {
    marginVertical: 2,
  },
  code_inline: {
    backgroundColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: "monospace",
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  fence: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginVertical: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
});
