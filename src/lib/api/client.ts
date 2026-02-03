const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchClient(endpoint: string, options: FetchOptions = {}) {
  const { params, ...init } = options;

  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';

  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const url = `${normalizedBase}${normalizedEndpoint}${queryString}`;

  console.log(`[API Request] ${options.method || 'GET'} ${url} (BASE_URL: ${BASE_URL})`);

  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...init.headers,
  };

  try {
    const response = await fetch(url, {
      ...init,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return null;

    return response.json();
  } catch (error) {
    console.error(`[API Failed] ${url}`, error);
    throw error;
  }
}

export const apiClient = {
  get: (endpoint: string, options?: FetchOptions) =>
    fetchClient(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: T, options?: FetchOptions) =>
    fetchClient(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: T, options?: FetchOptions) =>
    fetchClient(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: FetchOptions) =>
    fetchClient(endpoint, { ...options, method: 'DELETE' }),
};
