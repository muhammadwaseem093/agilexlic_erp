const API_BASE = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8100";

export type ApiEnvelope<T> = {
  success: boolean;
  correlation_id?: string;
  data?: T;
  error?: { code: string; message: string; details?: Record<string, unknown> };
};

export async function gatewayFetch<T>(path: string): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return response.json() as Promise<ApiEnvelope<T>>;
}
