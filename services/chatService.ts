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

// ─── Product recommendation via agent ────────────────────────────────────────

export const PRODUCT_IDS = [
  "inversion",
  "ahorro",
  "acciones",
  "hey_pro",
  "credito",
  "credito_negocios",
  "credito_personal",
  "proteccion",
  "hey_shop",
  "cuenta_hey",
  "debito",
  "credito_auto",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

const RECOMMENDATION_PROMPT = `Analiza mi perfil financiero completo usando las herramientas disponibles (segmento, perfil, historial de transacciones e insights) y devuelve ÚNICAMENTE un arreglo JSON con los 3 IDs de productos Hey Banco más relevantes para mí, ordenados de mayor a menor prioridad.

IDs válidos: ${PRODUCT_IDS.join(", ")}

Reglas estrictas:
- Usa solo IDs exactos de la lista anterior.
- Devuelve exactamente 3 IDs.
- Responde SOLO con el arreglo JSON, sin texto adicional, sin explicaciones, sin markdown.
- Ejemplo de respuesta válida: ["inversion","hey_pro","ahorro"]`;

/** Cache por userId para no re-consultar el agente si los datos no cambian */
const _recommendationCache = new Map<string, ProductId[]>();

export async function getAgentProductRecommendations(
  accessToken: string,
  userId: string,
  forceRefresh = false,
): Promise<ProductId[]> {
  if (!forceRefresh && _recommendationCache.has(userId)) {
    return _recommendationCache.get(userId)!;
  }

  const response = await sendChatMessage({
    message: RECOMMENDATION_PROMPT,
    accessToken,
    history: [],
  });

  // Extrae el arreglo JSON de la respuesta (robusto ante texto extra)
  const match = response.reply.match(/\[[\s\S]*?\]/);
  if (!match) throw new Error("Respuesta inválida del agente");

  const parsed: unknown[] = JSON.parse(match[0]);
  const validIds = parsed.filter(
    (id): id is ProductId =>
      typeof id === "string" && (PRODUCT_IDS as readonly string[]).includes(id),
  );

  if (validIds.length === 0) throw new Error("Sin IDs válidos en la respuesta");

  _recommendationCache.set(userId, validIds);
  return validIds;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

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
