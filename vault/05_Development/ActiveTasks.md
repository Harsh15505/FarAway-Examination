# FortisExam — Active Tasks

> **Last Updated:** 2026-06-11
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
| ~~Frontend Phase 1: Foundation~~ | Frontend | AI Agent | ✅ Design system, components, API client, routing — see below |

---

## ✅ Frontend Phase 1 — COMPLETE

### Files Created / Modified

| File | Status | Description |
|---|---|---|
| `web/src/index.css` | ✅ Done | Full design system: CSS tokens, layout, all components |
| `web/src/services/api.ts` | ✅ Done | Typed API client with all domain helpers + TypeScript types |
| `web/src/components/Layout.tsx` | ✅ Done | Dark sidebar + topbar layout matching Stitch design |
| `web/src/components/ui/index.tsx` | ✅ Done | Shared component library: Button, Card, StatCard, Badge, Modal, Table, Tabs, EmptyState, LoadingState, ErrorState, Alert, FormGroup, PageHeader, ConfirmDialog |
| `web/src/App.tsx` | ✅ Done | Full routing for 10 pages (Admin + Security), Clerk auth gate |
| `web/src/pages/Dashboard.tsx` | ✅ Done | Full dashboard matching Stitch A1 design |
| `web/src/pages/Questions.tsx` | ✅ Phase 2a placeholder |
| `web/src/pages/Exams.tsx` | ✅ Phase 2b placeholder |
| `web/src/pages/Packages.tsx` | ✅ Phase 2b placeholder |
| `web/src/pages/Distribution.tsx` | ✅ Phase 2b placeholder |
| `web/src/pages/Centers.tsx` | ✅ Phase 2b placeholder |
| `web/src/pages/Users.tsx` | ✅ Phase 2b placeholder |
| `web/src/pages/Audit.tsx` | ✅ Phase 4 placeholder |
| `web/src/pages/Monitoring.tsx` | ✅ Phase 4 placeholder |
| `web/src/pages/TamperDemo.tsx` | ✅ Phase 5 placeholder |

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

### Stitch Screen Inventory (39 screens, 7 projects)

| Project | Screens |
|---|---|
| FortisExam Admin Dashboard | 9 screens (A1–A9) |
| FortisExam Center Management Platform | 6 screens (A7 extended) |
| FortisExam Secure Portal | 4 screens (Expert + Center Admin) |
| FortisExam Security Operations Console | 7 screens (B1–B4, D2–D3) |
| FortisExam Candidate Kiosk | 4 screens (C4 variants) |
| FortisExam Kiosk Design System (1) | 5 screens (C1–C3, C6, C7) |
| FortisExam Kiosk Design System (2) | 4 screens (C1–C3 alternates) |

---

## 🟧 IN PROGRESS

| Task | Track | Assignee | Notes |
|---|---|---|---|
| Frontend Phase 2a: Dashboard + Question Bank | Frontend | AI Agent | Next — Questions, Exams screens |

---

## 📝 TODO (Immediate Next — Phase 2a)

1. `web/src/pages/Questions.tsx` — Question Bank with table, search, filters, add/edit/delete modal (Stitch: Question Bank List + Question Editor screens)
2. `web/src/pages/Exams.tsx` — Exam Builder with blueprint configurator (Stitch: Exam Blueprint Configurator + Exam List Dashboard screens)
3. `server/app/api/cloud/dashboard.py` — `GET /dashboard/stats` endpoint (GAP-6)

**Commit for Phase 2a:** `feat(frontend): implement Admin Dashboard and Question Bank UI`

---

## 🔵 Blocked

None currently.

---

## 📋 Backlog (Phase 2b – 5)

| Phase | Task |
|---|---|
| 2b | Packages, Distribution, Centers, Users pages |
| 2b | Backend: Center CRUD endpoints (GAP-1/2/3) |
| 3a | Electron kiosk: QR scan, face verify, waiting room |
| 3b | Exam taking, review, submission, crash recovery |
| 4  | Audit Explorer, Chain Verification, Proctor Dashboard, Live Monitoring |
| 4  | Backend: Active sessions list + acknowledge alert endpoints (GAP-4/5) |
| 5  | Demo seed/reset scripts, tamper demo page |

---

## Related Documents

- [[SprintBoard]] — Full sprint breakdown
- [[FrontendImplementationPlan]] — Phase-by-phase plan
- [[Blockers]] — Active blockers
