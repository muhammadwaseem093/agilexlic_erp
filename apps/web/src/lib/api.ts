import { z } from "zod";

// Server-side calls use the internal service address; the public URL is the browser-facing fallback.
const API_BASE =
  process.env.GATEWAY_INTERNAL_URL ?? process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8100";

const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ApiEnvelope<T> = {
  success: boolean;
  correlation_id?: string;
  data?: T;
  error?: z.infer<typeof apiErrorSchema>;
};

function envelopeSchema<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    success: z.boolean(),
    correlation_id: z.string().optional(),
    data: data.optional(),
    error: apiErrorSchema.optional(),
  });
}

/** Fetch from the gateway and validate the response shape; malformed payloads throw instead of leaking through. */
export async function gatewayFetch<T extends z.ZodTypeAny>(
  path: string,
  dataSchema: T,
): Promise<ApiEnvelope<z.infer<T>>> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return envelopeSchema(dataSchema).parse(await response.json()) as ApiEnvelope<z.infer<T>>;
}

export const healthSchema = z.object({ status: z.string() });
