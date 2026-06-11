# FortisExam — Context Summary

> **Last Updated:** 2026-06-10

---

## Quick Context for AI Agents

### What Is This Project?
FortisExam is a Zero-Trust, Edge-First examination infrastructure for large-scale national exams (NEET, JEE, UPSC). It prevents paper leaks through encryption, prevents copying through spatial randomization, and ensures accountability through hash-chained audit trails.

### Current Status
**Currently Completed:**
* **Architecture:** Core design, D-001 through D-015, SQLite edge DB (Redis removed).
* **Module 01 (Question Pool):** Fully implemented. Alembic migrations, QuestionService with AES-256-GCM auto-encryption, Clerk JWT RBAC protected cloud routes, 12 unit/integration/security tests.
* **Module 02 (Crypto Delivery):** Fully implemented. AES-256-GCM, RSA-2048, and PackageService complete. D-012 Admin key release endpoint active.
* **Module 03 (Authentication):** Fully implemented. JWTHandler (RS256), QRTokenService (RSA sig + anti-replay nonce), FaceVerificationService (cosine similarity), AuthService (8-step pipeline), Clerk JWKS middleware, RBAC, supervisor override. 63 new tests.
* **Module 04 (Graph Randomization):** Core logic, deterministic seeding, graph coloring.
* **Module 05 (State Recovery):** Auto-snapshots to SQLite on every answer, async API endpoints, hash integrity verification, session status restoration, 58/58 tests passing with 99% coverage.
* **Module 06 (Anomaly Detection):** Fully implemented. RuleEngine with 5 detection rules (multiple faces, no face, gaze deviation, camera blocked, rapid answer changes), debounce cooldowns, MonitoringService with audit integration, SecurityEvent model, 3 edge API endpoints, 49 tests.
* **Module 07 (Audit Ledger):** Chained hashing, generic `EventLogger`, PostgreSQL+SQLite support, 87 unit/integration/security tests passing with 98% coverage.
- **Phase:** Sprint 1 — Backend & Crypto Implementation (ALL 7 MODULES COMPLETE)
- **Next Step:** Electron scaffold + kiosk mode, React exam UI, Docker Compose integration.
- **Code exists for:** Questions API (`server/app/api/cloud/questions.py`), Monitoring API (`server/app/api/edge/monitoring.py`), Graph subsystem (`shared/graph/`), audit module (`server/app/api/common/audit.py`, `server/app/services/audit_service.py`, `shared/audit/`), crypto package (`shared/crypto/`), auth pipeline (`server/app/services/auth_service.py`, `server/app/middleware/`), anomaly detection (`shared/monitoring/rule_engine.py`)

### Tech Stack
- Backend: Python, FastAPI, PostgreSQL
- Edge: Python, FastAPI, SQLite (WAL mode) — Redis removed per D-010
- Desktop: Electron, React, TypeScript
- AI: MediaPipe, InsightFace, OpenCV
- Crypto: AES-256-GCM, RSA-2048 (demo) / RSA-4096 (production, D-008), SHA-256
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
