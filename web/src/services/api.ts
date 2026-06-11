/**
 * API Client — Authenticated HTTP calls to cloud and edge servers.
 * Uses Clerk session token for cloud admin portal.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

async function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<string> {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function apiClient(
  path: string,
  options: ApiOptions = {},
  token?: string | null,
): Promise<Response> {
  const { params, ...fetchOptions } = options;
  const url = await buildUrl(path, params);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };
  return fetch(url, { ...fetchOptions, headers });
}

/** Typed JSON response helper — throws on non-2xx */
export async function apiJson<T>(
  path: string,
  options: ApiOptions = {},
  token?: string | null,
): Promise<T> {
  const res = await apiClient(path, options, token);
  if (!res.ok) {
    let message = `API error ${res.status}`;
    try { const body = await res.json(); message = body.detail || body.message || message; } catch (_) {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ─── Domain-specific API helpers ───────────────────────────

export const dashboardApi = {
  getStats: (token: string) =>
    apiJson<DashboardStats>('/dashboard/stats', {}, token),
};

export const questionsApi = {
  list: (token: string, params?: { subject?: string; difficulty?: string; status?: string }) =>
    apiJson<QuestionListResponse>('/questions', { params }, token),
  create: (token: string, body: CreateQuestionRequest) =>
    apiJson<Question>('/questions', { method: 'POST', body: JSON.stringify(body) }, token),
  update: (token: string, id: string, body: Partial<CreateQuestionRequest>) =>
    apiJson<Question>(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token),
  delete: (token: string, id: string) =>
    apiClient(`/questions/${id}`, { method: 'DELETE' }, token),
};

export const examsApi = {
  list: (token: string) =>
    apiJson<ExamListResponse>('/exams', {}, token),
  create: (token: string, body: CreateExamRequest) =>
    apiJson<Exam>('/exams', { method: 'POST', body: JSON.stringify(body) }, token),
  compile: (token: string, id: string) =>
    apiJson<Package>(`/exams/${id}/compile`, { method: 'POST' }, token),
  releaseKey: (token: string, id: string) =>
    apiJson<KeyReleaseResponse>(`/exams/${id}/release-key`, { method: 'POST' }, token),
};

export const packagesApi = {
  list: (token: string) =>
    apiJson<Package[]>('/packages', {}, token),
  download: (token: string, id: string) =>
    apiClient(`/packages/${id}/download`, {}, token),
  verify: (token: string, id: string) =>
    apiJson<VerifyResponse>(`/packages/${id}/verify`, { method: 'POST' }, token),
};

export const distributionApi = {
  listPackages: (token: string) =>
    apiJson<DistributionPackage[]>('/distribution/packages', {}, token),
  getStatus: (token: string, examId: string) =>
    apiJson<DistributionStatus>(`/distribution/status/${examId}`, {}, token),
};

export const centersApi = {
  list: (token: string) =>
    apiJson<Center[]>('/centers', {}, token),
  create: (token: string, body: CreateCenterRequest) =>
    apiJson<Center>('/centers', { method: 'POST', body: JSON.stringify(body) }, token),
  update: (token: string, id: string, body: Partial<CreateCenterRequest>) =>
    apiJson<Center>(`/centers/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token),
};

export const usersApi = {
  list: (token: string) =>
    apiJson<User[]>('/users', {}, token),
  sync: (token: string, body: SyncUserRequest) =>
    apiJson<SyncUserResponse>('/users/sync', { method: 'POST', body: JSON.stringify(body) }, token),
};

export const auditApi = {
  getEvents: (token: string, params?: { event_type?: string; exam_id?: string; limit?: number; offset?: number }) =>
    apiJson<AuditEventListResponse>('/audit/events', { params }, token),
  getChain: (token: string) =>
    apiJson<AuditChainResponse>('/audit/chain', {}, token),
  verify: (token: string) =>
    apiJson<AuditVerifyResponse>('/audit/verify', { method: 'POST' }, token),
  export: (token: string, format: 'json' | 'csv') =>
    apiClient(`/audit/export?format=${format}`, {}, token),
};

export const monitoringApi = {
  getEvents: (token: string, params?: { session_id?: string; limit?: number }) =>
    apiJson<MonitoringEvent[]>('/monitoring/events', { params }, token),
  acknowledge: (token: string, id: string) =>
    apiClient(`/monitoring/events/${id}/acknowledge`, { method: 'PATCH' }, token),
};

// ─── Types ─────────────────────────────────────────────────

export interface DashboardStats {
  total_questions: number;
  total_exams: number;
  total_centers: number;
  total_audit_events: number;
  active_sessions: number;
  critical_alerts: number;
  recent_activity: ActivityItem[];
  package_distribution_status: PackageDistStatus[];
}

export interface ActivityItem {
  id: string;
  type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'CRYPTO';
  message: string;
  actor: string;
  timestamp: string;
}

export interface PackageDistStatus {
  exam_name: string;
  distributed: number;
  total: number;
}

export interface Question {
  id: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  content_hash: string;
  is_encrypted: boolean;
  status: 'DRAFT' | 'ENCRYPTED' | 'ACTIVE';
  preview?: string;
  created_at: string;
}

export interface QuestionListResponse {
  items: Question[];
  total: number;
}

export interface CreateQuestionRequest {
  question_text: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Exam {
  id: string;
  name: string;
  status: 'DRAFT' | 'COMPILED' | 'DISTRIBUTED' | 'KEY_RELEASED' | 'ACTIVE' | 'COMPLETED';
  question_count: number;
  center_count: number;
  exam_date: string;
  created_at: string;
}

export interface ExamListResponse {
  items: Exam[];
  total: number;
}

export interface CreateExamRequest {
  name: string;
  exam_date: string;
  duration_minutes: number;
  blueprint: BlueprintItem[];
  center_ids: string[];
}

export interface BlueprintItem {
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
}

export interface Package {
  id: string;
  exam_id: string;
  exam_name: string;
  status: 'generated' | 'distributed' | 'key_released';
  package_hash: string;
  signature_b64: string;
  created_at: string;
}

export interface KeyReleaseResponse {
  wrapped_key_b64: string;
  released_at: string;
}

export interface VerifyResponse {
  valid: boolean;
  package_hash: string;
}

export interface DistributionPackage {
  exam_id: string;
  exam_name: string;
  packages: Package[];
}

export interface DistributionStatus {
  exam_id: string;
  centers: { center_id: string; center_name: string; status: string; distributed_at?: string }[];
}

export interface Center {
  id: string;
  name: string;
  city: string;
  state: string;
  seat_count: number;
  assigned_exam?: string;
  risk_score?: number;
  status: 'active' | 'inactive';
}

export interface CreateCenterRequest {
  name: string;
  city: string;
  state: string;
  address: string;
  seat_count: number;
}

export interface User {
  clerk_user_id: string;
  name: string;
  email: string;
  role: 'admin' | 'expert' | 'auditor' | 'center_admin' | 'invigilator';
}

export interface SyncUserRequest {
  clerk_user_id: string;
  name: string;
  role: User['role'];
}

export interface SyncUserResponse extends User {
  created: boolean;
}

export interface AuditEvent {
  id: number;
  event_type: string;
  actor: string;
  center_id?: string;
  candidate_id?: string;
  timestamp: string;
  current_hash: string;
  prev_hash?: string;
  status: 'valid' | 'tampered';
}

export interface AuditEventListResponse {
  items: AuditEvent[];
  total: number;
}

export interface AuditChainResponse {
  events: AuditEvent[];
  chain_valid: boolean;
  total_events: number;
}

export interface AuditVerifyResponse {
  valid: boolean;
  total_events: number;
  broken_at?: number;
  message: string;
}

export interface MonitoringEvent {
  id: string;
  session_id: string;
  candidate_id: string;
  event_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, unknown>;
  acknowledged: boolean;
  created_at: string;
}
