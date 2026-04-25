import { AppHeader } from "@/components/AppHeader";
import { ChatBubble } from "@/components/ChatBubble";
import { TextInputBar } from "@/components/TextInputBar";
import { colors, fontSize, spacing } from "@/constants/design";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, sendChatMessage } from "@/services/chatService";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Message = ChatMessage & { id: string; loading?: boolean };

/**
 * Extrae el texto de una respuesta que puede ser string u objeto complejo
 */
function extractTextFromReply(reply: any): string {
  if (typeof reply === "string") {
    return reply;
  }

  // Si es un objeto con propiedad text
  if (reply && typeof reply === "object") {
    if ("text" in reply && typeof reply.text === "string") {
      return reply.text;
    }
    // Si es un array de objetos con text
    if (Array.isArray(reply)) {
      return reply
        .map((item) => (typeof item === "string" ? item : item.text || ""))
        .filter(Boolean)
        .join("\n");
    }
  }

  // Fallback: convertir a JSON
  return JSON.stringify(reply);
}

export default function ChatbotScreen() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
      };

      const loadingMsg: Message = {
        id: "loading",
        role: "assistant",
        content: "",
        loading: true,
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setLoading(true);

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );

      try {
        if (!session?.access_token) {
          throw new Error("No estás autenticado");
        }

        const res = await sendChatMessage({
          message: text,
          accessToken: session.access_token,
        });

        const replyText = extractTextFromReply(res.reply);

        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "loading"),
          { id: Date.now().toString(), role: "assistant", content: replyText },
        ]);
      } catch (err) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "loading"),
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "Lo siento, hubo un problema al conectar con el asistente. Inténtalo de nuevo.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  return (
    <View style={styles.root}>
      <AppHeader title="Chatbot" subtitle="Asistente financiero" />

      {messages.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>¿En qué puedo ayudarte?</Text>
          <Text style={styles.emptySubtitle}>
            Pregúntame sobre tus finanzas, inversiones o cualquier duda que
            tengas.
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            role={item.role}
            content={item.content}
            isLoading={item.loading}
          />
        )}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <TextInputBar onSend={sendMessage} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messageList: {
    padding: spacing.md,
    gap: spacing.xs,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.foreground,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
});
