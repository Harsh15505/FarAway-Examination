# FortisExam — Active Tasks

> **Last Updated:** 2026-06-12
> **Current Sprint:** Sprint 2 (Frontend & Desktop)

---

## 🟢 Completed

| Task | Track | Assignee | Notes |
|---|---|---|---|
| ~~Vault creation~~ | Docs | AI Agent | ✅ Complete |
| ~~Architecture analysis~~ | Docs | AI Agent | ✅ Complete |
| ~~Sprint planning~~ | Docs | AI Agent | ✅ Complete |
| ~~Module 04: Graph Randomization~~ | Backend | AI Agent | ✅ Complete |
| ~~Module 05: State Recovery~~ | Backend | Team Member | ✅ Complete (58 tests, 99% coverage) |
| ~~Module 07: Audit Ledger~~ | Backend | AI Agent | ✅ 87 tests, 98% coverage |
| ~~Module 02: Crypto Delivery~~ | Backend | AI Agent | ✅ 219 tests, 92% coverage |
| ~~Module 03: Authentication~~ | Backend | AI Agent | ✅ 282 tests, 81% coverage |
| ~~Module 02 & 03 Test Hardening~~ | QA | ayaan-goel | ✅ 354 total tests |
| ~~Module 01: Question Pool~~ | Backend | AI Agent | ✅ 12 tests, Alembic schema, CRUD |
| ~~Module 06: Anomaly Detection~~ | Backend | Harsh Bhavsar | ✅ 49 tests, rule engine, 3 API endpoints |
| ~~Frontend Phase 1: Foundation~~ | Frontend | AI Agent | ✅ Design system, components, API client, routing |
| ~~Frontend Phase 2a: Question Bank~~ | Frontend | Harsh Bhavsar | ✅ Questions list, QuestionEditor, Dashboard — merged to main 2026-06-12 |

---

## ✅ Frontend Phase 1 — COMPLETE

### Files Created / Modified

| File | Status | Description |
|---|---|---|
| `web/src/index.css` | ✅ Done | Full design system: CSS tokens, layout, all components |
| `web/src/services/api.ts` | ✅ Done | Typed API client with all domain helpers + TypeScript types |
| `web/src/components/Layout.tsx` | ✅ Done | Dark sidebar + topbar layout |
| `web/src/components/ui/index.tsx` | ✅ Done | Shared library: Button, Card, StatCard, Badge, Modal, Table, Tabs, EmptyState, LoadingState, ErrorState, Alert, FormGroup, PageHeader, ConfirmDialog |
| `web/src/App.tsx` | ✅ Done | Full routing for 12 pages, Clerk auth gate |
| `web/src/pages/Dashboard.tsx` | ✅ Done | Stats, Activity Feed, Center Risk Map, Package Distribution |

### Design System Summary

| Token | Value |
|---|---|
| Sidebar BG | `#1a237e` (Deep Navy Indigo) |
| Primary Action | `#1565c0` (Bright Blue) |
| Content BG | `#f0f2f5` (Light Grey-Blue) |
| Surface/Cards | `#ffffff` |
| Success | `#43a047` |
| Warning | `#f59e0b` |
| Danger | `#ef4444` |
| Font | Inter (Google Fonts) |
| Sidebar width | 220px |
| Topbar height | 56px |

---

## ✅ Frontend Phase 2a — COMPLETE (merged to main 2026-06-12)

### Deliverables

| File | Status | Description |
|---|---|---|
| `web/src/pages/Questions.tsx` | ✅ Done | Question Bank: table (id/subject/difficulty/status/created), search, filters, sidebar stats (donut chart, difficulty bar, encryption counts), delete confirm modal, wired to `questionsApi.list/delete` with Clerk auth |
| `web/src/pages/QuestionEditor.tsx` | ✅ Done | Question Editor: content textarea with toolbar, A/B/C/D options with radio correct-answer, SHA-256 hash computed live via SubtleCrypto, AI normalizer panel, subject/difficulty metadata, preview card, Save Draft + Save & Encrypt buttons wired to `questionsApi.create/update` |
| `web/src/App.tsx` | ✅ Updated | Added `/questions/new` and `/questions/:id/edit` routes |

### Integration Notes

| Item | Status |
|---|---|
| Uses Phase 1's `index.css` CSS variables throughout (no Tailwind) | ✅ |
| Uses Phase 1's `ui/index.tsx` components (Card, Table, Badge, Button, etc.) | ✅ |
| `QuestionMeta.is_encrypted` (boolean) for status display | ✅ |
| `QuestionCreateRequest.options` as `{A, B, C, D}` dict | ✅ |
| `Dashboard.tsx` falls back to demo data with banner when backend GAP-3 missing | ✅ |
| TypeScript: 0 errors | ✅ |
| Build: passed (vite 2.16s) | ✅ |
| Tests: 415 passed, 0 failures | ✅ |

---

## 🟧 IN PROGRESS / UP NEXT

| Task | Track | Assignee | Notes |
|---|---|---|---|
| Frontend Phase 2b: Exam Config, Packages, Centers, Users | Frontend | Harsh Bhavsar | Needs GAP-1/2 backend first |
| Backend GAP-1: ExamService stubs | Backend | ayaan-goel | `exam_service.py` create/list/get/compile |
| Backend GAP-2: Centers CRUD | Backend | ayaan-goel | schema + service + router + main.py |
| Backend GAP-3: Dashboard stats endpoint | Backend | ayaan-goel | `GET /dashboard/stats` |

---

## 🔴 Backend Gaps (Needed Before Phase 2b Frontend)

> See full detail: [[BackendGaps]]

| Gap | What's Missing | Files | Priority |
|---|---|---|---|
| GAP-1 | `ExamService` methods + `exams.py` route handlers (all `...` stubs) | `services/exam_service.py`, `api/cloud/exams.py` | 🔴 High |
| GAP-2 | Centers CRUD endpoints — no router, no schema, no service | `schemas/center.py`, `services/center_service.py`, `api/cloud/centers.py`, `main.py` | 🔴 High |
| GAP-3 | `GET /dashboard/stats` endpoint — Dashboard uses demo data without it | `api/cloud/dashboard.py`, `main.py` | 🟡 Medium |

**Note:** Frontend `api.ts` is already wired for all 3 gaps. Zero frontend changes needed once backend fills them in.

---

## 📋 Backlog (Phase 2b – 5)

| Phase | Task |
|---|---|
| 2b | Exams, Packages, Distribution, Centers, Users pages |
| 2b | Backend: Center CRUD endpoints (GAP-1/2/3) |
| 3a | Electron kiosk: QR scan, face verify, waiting room |
| 3b | Exam taking, review, submission, crash recovery |
| 4  | Audit Explorer, Chain Verification, Proctor Dashboard, Live Monitoring |
| 4  | Backend: Active sessions list + acknowledge alert endpoints (GAP-4/5) |
| 5  | Demo seed/reset scripts, tamper demo page |

---

## Related Documents

- [[BackendGaps]] — Active backend gaps
- [[StitchScreenRegistry]] — Stitch screen → phase mapping
