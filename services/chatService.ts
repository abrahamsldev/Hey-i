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
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  payload: ChatRequest,
): Promise<ChatResponse> {
  const url = `${LAMBDA_BASE_URL}/chat`;

  const controller = new AbortController();
  // 5 minutos — tiempo suficiente para iterar todos los modelos de fallback
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.accessToken}`,
      },
      body: JSON.stringify({
        message: payload.message,
        history: payload.history ?? [],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Error del servidor: ${response.status}`,
      );
    }

    return response.json();
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("La solicitud tardó demasiado. Inténtalo de nuevo.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
