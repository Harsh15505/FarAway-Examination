/**
 * Edge API Client — HTTP calls to local edge server.
 *
 * No Clerk. No internet. Direct connection to edge server on local network.
 */

const EDGE_SERVER_URL = 'http://localhost:8001/api/v1';

export async function edgeClient(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  return fetch(`${EDGE_SERVER_URL}${path}`, {
    ...options,
    headers,
  });
}
