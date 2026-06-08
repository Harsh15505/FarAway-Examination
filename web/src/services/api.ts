/**
 * API Client — authenticated HTTP calls to cloud server.
 *
 * All requests include Clerk session token via useAuth().getToken().
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export async function apiClient(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
}
