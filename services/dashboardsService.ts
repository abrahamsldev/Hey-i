import { Dashboard } from "@/types/dashboards";

const LAMBDA_BASE_URL =
  process.env.EXPO_PUBLIC_LAMBDA_API_URL ??
  "https://qlo69njeb0.execute-api.us-east-2.amazonaws.com";

// 🔹 helper genérico (igual patrón que chat)
async function fetchFromLambda<T>(
  endpoint: string,
  accessToken: string,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

  try {
    const response = await fetch(`${LAMBDA_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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

export async function getSpendingDashboard(
  accessToken: string,
): Promise<Dashboard> {
  const data = await fetchFromLambda<any>(
    "/get_spending_dashboard",
    accessToken,
  );

  return data.structuredContent;
}

export async function getSavingsDashboard(
  accessToken: string,
): Promise<Dashboard> {
  const data = await fetchFromLambda<any>(
    "/get_savings_dashboard",
    accessToken,
  );

  return data.structuredContent;
}

export async function getDashboards(
  accessToken: string,
): Promise<{
  spending: Dashboard;
  savings: Dashboard;
}> {
  const [spending, savings] = await Promise.all([
    getSpendingDashboard(accessToken),
    getSavingsDashboard(accessToken),
  ]);

  return { spending, savings };
}

export function formatCurrency(
  amount: number,
  currency: string = "MXN",
  decimals: number = 0,
): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}
