/** API client service — wraps fetch with Clerk JWT auth headers. */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getQuestions: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/questions${qs}`);
  },
  getQuestion: (id: string) => request<any>(`/questions/${id}`),
  createQuestion: (data: any) => request<any>('/questions', { method: 'POST', body: JSON.stringify(data) }),
  updateQuestion: (id: string, data: any) => request<any>(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuestion: (id: string) => request<any>(`/questions/${id}`, { method: 'DELETE' }),
  getExams: () => request<any>('/exams'),
  createExam: (data: any) => request<any>('/exams', { method: 'POST', body: JSON.stringify(data) }),
  compileExam: (id: string) => request<any>(`/exams/${id}/compile`, { method: 'POST' }),
  getPackage: (id: string) => request<any>(`/packages/${id}`),
  verifyPackage: (id: string) => request<any>(`/packages/${id}/verify`, { method: 'POST' }),
  getAuditChain: (examId: string) => request<any>(`/audit/chain/${examId}`),
  verifyAuditChain: (examId: string) => request<any>(`/audit/verify/${examId}`, { method: 'POST' }),
  getDashboardStats: () => request<any>('/dashboard/stats'),
  getUsers: () => request<any>('/users'),
};

export default api;
