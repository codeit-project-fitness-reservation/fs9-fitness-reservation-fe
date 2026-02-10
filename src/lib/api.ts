export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function getErrorMessage(json: unknown): string {
  if (json && typeof json === 'object' && 'error' in json) {
    const err = (json as { error?: { message?: string; details?: string } }).error;
    if (err?.message) return err.message;
    if (err?.details) return err.details;
  }
  if (json && typeof json === 'object' && 'message' in json) {
    return String((json as { message: unknown }).message);
  }
  return '요청 처리에 실패했습니다.';
}

type AuthFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; errorDetails?: string };

function resolveUrl(path: string): string {
  return path.startsWith('/api/') ? path : `${API_BASE}${path}`;
}

function toHeaderRecord(headersInit: RequestInit['headers']): Record<string, string> {
  const out: Record<string, string> = {};
  if (!headersInit) return out;

  if (typeof Headers !== 'undefined' && headersInit instanceof Headers) {
    headersInit.forEach((v, k) => {
      out[k] = v;
    });
    return out;
  }

  if (Array.isArray(headersInit)) {
    headersInit.forEach(([k, v]) => {
      out[k] = v;
    });
    return out;
  }

  return { ...(headersInit as Record<string, string>) };
}

function hasHeader(headers: Record<string, string>, name: string): boolean {
  const lower = name.toLowerCase();
  return Object.keys(headers).some((k) => k.toLowerCase() === lower);
}

async function safeJson(res: Response): Promise<unknown> {
  return await res.json().catch(() => ({}));
}

export async function authFetch<T = unknown>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: Record<string, unknown> } = {},
): Promise<AuthFetchResult<T>> {
  const { body, ...rest } = options;
  const url = resolveUrl(path);
  const headers = toHeaderRecord(options.headers);

  if (!hasHeader(headers, 'Content-Type')) {
    headers['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      credentials: rest.credentials ?? 'include',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : '네트워크 오류가 발생했습니다.';
    return { ok: false, error: message };
  }

  const json = (await safeJson(res)) as {
    success?: boolean;
    data?: T;
    error?: { message?: string; details?: string };
  };

  if (!res.ok) {
    return {
      ok: false,
      error: json.error?.message || json.error?.details || `HTTP ${res.status}`,
      errorDetails: json.error?.details,
    };
  }

  return { ok: true, data: json.data as T };
}
