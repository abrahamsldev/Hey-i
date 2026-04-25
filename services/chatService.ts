const LAMBDA_BASE_URL = process.env.EXPO_PUBLIC_LAMBDA_API_URL ?? "";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  userId: string | null;
  conversationId: string | null;
}

export interface ChatResponse {
  reply: string;
  conversationId?: string;
}

export async function sendChatMessage(
  payload: ChatRequest,
): Promise<ChatResponse> {
  const url = `${LAMBDA_BASE_URL}/chat`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}`);
  }

  return response.json();
}
