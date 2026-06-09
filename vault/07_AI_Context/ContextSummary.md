# FortisExam — Context Summary

> **Last Updated:** 2026-06-09

---

## Quick Context for AI Agents

### What Is This Project?
FortisExam is a Zero-Trust, Edge-First examination infrastructure for large-scale national exams (NEET, JEE, UPSC). It prevents paper leaks through encryption, prevents copying through spatial randomization, and ensures accountability through hash-chained audit trails.

### Current Status
- **Phase:** Sprint 1 — Backend & Crypto Implementation (Modules 04 and 07 complete)
- **Next Step:** Complete remaining Sprint 1 tasks (Crypto primitives, Question API, Server scaffold)
- **Code exists for:** Graph subsystem (`shared/graph/`), audit module (`server/app/api/common/audit.py`, `server/app/services/audit_service.py`, `shared/audit/`)

### Tech Stack
- Backend: Python, FastAPI, PostgreSQL, Redis
- Edge: Python, FastAPI, SQLite, Redis
- Desktop: Electron, React, TypeScript
- AI: MediaPipe, InsightFace, OpenCV
- Crypto: AES-256-GCM, RSA-4096, HKDF, SHA-256
- Graphs: NetworkX

### Architecture
- 3 zones: Cloud (authoring) → Distribution → Edge (exam execution)
- 7 modules: Question Pool, Crypto Delivery, Authentication, Graph Randomization, State Recovery, Anomaly Detection, Audit Ledger
- 4 security layers: Identity → Content → Execution → Audit

### Key Decisions Made
- D-001: Edge-First over Cloud-First
- D-002: AES-256-GCM for question encryption
- D-003: SQLite for edge persistence
- D-004: Graph coloring for anti-copying
- D-005: Hash-chained audit ledger
- D-006: Electron for candidate kiosk
- D-007: MediaPipe for edge AI

### Hackathon Demo Scope
8 flows to demonstrate: question creation, package encryption, candidate auth, spatial randomization, exam execution, state recovery, audit logging, anomaly detection.

---

## Where to Find Things

| Need | Location |
|---|---|
| Project overview | `vault/00_Project/ProjectOverview.md` |
| Current status | `vault/00_Project/CurrentState.md` |
| Architecture decisions | `vault/00_Project/Decisions.md` |
| Module details | `vault/03_Modules/Module0X_*.md` |
| API specs | `vault/04_Implementation/APIContracts.md` |
| DB schema | `vault/04_Implementation/DatabaseDesign.md` |
| Repo structure | `vault/04_Implementation/RepositoryStructure.md` |
| Sprint plan | `vault/05_Development/SprintBoard.md` |
| Current tasks | `vault/05_Development/ActiveTasks.md` |
| Test plan | `vault/06_Testing/TestPlan.md` |
| Source docs | `docs/PRD.md`, `docs/TRD.md`, `docs/Architecture.md` |

---

## Related Documents

- [[AIInstructions]] — Full AI behavior rules
- [[PromptPatterns]] — Useful prompt patterns
- [[AIHandoffTemplate]] — Session handoff format
