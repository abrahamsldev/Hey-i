import { supabase } from "@/lib/supabase";
import { ChatMessage } from "./chatService";

// Número de mensajes previos a enviar como contexto al Lambda
const HISTORY_LIMIT = 20;

export async function loadChatHistory(userId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);

  if (error) throw error;

  // Revertir para orden cronológico (más antiguo primero)
  return ((data || []) as ChatMessage[]).reverse();
}

export async function saveMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
): Promise<void> {
  const { error } = await supabase
    .from("chat_messages")
    .insert({ user_id: userId, role, content });

  if (error) throw error;
}

export async function clearChatHistory(userId: string): Promise<void> {
  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}
