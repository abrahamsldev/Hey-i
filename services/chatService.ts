const LAMBDA_BASE_URL =
  process.env.EXPO_PUBLIC_LAMBDA_API_URL ??
  "https://qlo69njeb0.execute-api.us-east-2.amazonaws.com";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  accessToken: string;
}

export interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  payload: ChatRequest,
): Promise<ChatResponse> {
  const url = `${LAMBDA_BASE_URL}/chat`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${payload.accessToken}`,
    },
    body: JSON.stringify({
      message: payload.message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Error del servidor: ${response.status}`,
    );
  }

  return response.json();
}
