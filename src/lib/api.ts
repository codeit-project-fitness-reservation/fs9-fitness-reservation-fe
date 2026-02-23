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
  if (path.startsWith('/api/')) {
    return path;
  }
  return `${API_BASE}${path}`;
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
  options: Omit<RequestInit, 'body'> & { body?: Record<string, unknown> | FormData } = {},
): Promise<AuthFetchResult<T>> {
  const { body, ...rest } = options;
  const url = resolveUrl(path);
  const headers = toHeaderRecord(options.headers);

  if (!hasHeader(headers, 'Content-Type') && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      credentials: rest.credentials ?? 'include',
      headers,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : '네트워크 오류가 발생했습니다.';
    return { ok: false, error: message };
  }

  // 304 Not Modified: body 소비 전에 먼저 처리
  // no-cache 헤더를 붙여 재요청하여 실제 데이터를 가져옴
  if (res.status === 304) {
    try {
      const freshRes = await fetch(url, {
        ...rest,
        credentials: rest.credentials ?? 'include',
        headers: { ...headers, 'Cache-Control': 'no-cache' },
        body:
          body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      });
      const freshJson = (await safeJson(freshRes)) as {
        success?: boolean;
        data?: T;
        message?: string;
        error?: { message?: string; details?: string };
      };
      if (freshRes.ok) {
        const d = freshJson.data !== undefined ? freshJson.data : (freshJson as unknown as T);
        return { ok: true, data: d };
      }
    } catch {
      // fallthrough
    }
    return { ok: false, error: 'NOT_MODIFIED' };
  }

  const json = (await safeJson(res)) as {
    success?: boolean;
    data?: T;
    message?: string;
    error?: { message?: string; details?: string };
  };

  if (!res.ok) {
    const errorMsg =
      json.error?.message || json.error?.details || json.message || `HTTP ${res.status}`;

    return {
      ok: false,
      error: errorMsg,
      errorDetails:
        json.error?.details || (typeof json.error === 'string' ? json.error : undefined),
    };
  }

  const responseData = json.data !== undefined ? json.data : (json as unknown as T);
  return { ok: true, data: responseData };
}

export type QueryParams = Record<string, string | number | undefined>;

function toQueryString(params: QueryParams): string {
  const entries = Object.entries(params)
    .filter(([, v]) => v != null)
    .map(([k, v]) => [k, String(v)] as [string, string]);
  return entries.length > 0 ? '?' + new URLSearchParams(entries).toString() : '';
}

export const apiClient = {
  get: async <T = unknown>(endpoint: string, options?: { params?: QueryParams }) => {
    const queryString = options?.params ? toQueryString(options.params) : '';
    const url = `${endpoint}${queryString}`;
    const result = await authFetch<T>(url, { method: 'GET' });
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  },

  post: async <T = unknown, B = unknown>(endpoint: string, body: B) => {
    const result = await authFetch<T>(endpoint, {
      method: 'POST',
      body: body as Record<string, unknown> | FormData,
    });
    if (!result.ok) throw new Error(result.error);
    return result.data;
  },

  put: async <T = unknown, B = unknown>(endpoint: string, body: B) => {
    const result = await authFetch<T>(endpoint, {
      method: 'PUT',
      body: body as Record<string, unknown> | FormData,
    });
    if (!result.ok) throw new Error(result.error);
    return result.data;
  },

  patch: async <T = unknown, B = unknown>(endpoint: string, body: B) => {
    const result = await authFetch<T>(endpoint, {
      method: 'PATCH',
      body: body as Record<string, unknown> | FormData,
    });
    if (!result.ok) throw new Error(result.error);
    return result.data;
  },

  delete: async <T = unknown>(endpoint: string, body?: Record<string, unknown>) => {
    const result = await authFetch<T>(endpoint, { method: 'DELETE', body });
    if (!result.ok) throw new Error(result.error);
    return result.data;
  },
};
