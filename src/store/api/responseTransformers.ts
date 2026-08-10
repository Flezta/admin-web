export interface ApiResponseEnvelope<T> {
  message?: string;
  data?: T;
}

export interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export interface NormalizedApiError {
  status: number | string;
  message: string;
}

export function unwrapApiData<T>(response: ApiResponseEnvelope<T> | T): T {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data !== undefined
  ) {
    return response.data;
  }

  return response as T;
}

export function normalizeApiError(response: unknown): NormalizedApiError {
  const err = response as { status?: number | string; data?: unknown };
  const payload = err.data as ApiErrorPayload | undefined;

  return {
    status: err.status ?? "UNKNOWN",
    message: payload?.error || payload?.message || "Request failed",
  };
}
