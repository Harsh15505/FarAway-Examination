# FortisExam — Changelog

> **Last Updated:** 2026-06-10

---

## [Unreleased]

---

### 2026-06-10 — Module 02 & 03 Test Hardening
- **Fixed** `PytestCollectionWarning` by renaming `TestBase` → `_TestBase` in package integration tests
- **Added** AES decrypt key-size validation test (covers `aes.py` line 91)
- **Added** `DistributionService.list_packages()` and `get_delivery_status()` tests (5 new tests)
- **Added** `JWTHandler.decode_clerk_jwt()` tests with mocked JWKS (4 new tests: valid decode, missing kid, kid not found, fetch failure)
- **Added** Clerk middleware production path tests (missing auth header, invalid JWT)
- **Results:** 354 total tests passing, 0 warnings, 0 errors

### 2026-06-10 — Module 03: Authentication (Complete)
- **Implemented** `shared/crypto/jwt_handler.py` — RS256 create_token, verify_token, decode_clerk_jwt (JWKS)
- **Created** `server/app/models/used_nonce.py` — SQLite anti-replay nonce store
- **Implemented** `server/app/services/qr_token_service.py` — QRTokenService (parse → RSA verify → expiry → anti-replay) + QRTokenGenerator
- **Implemented** `server/app/services/face_verification_service.py` — cosine similarity on 512-dim float32 embeddings
- **Implemented** `server/app/services/auth_service.py` — 8-step auth orchestration: QR → candidate lookup → face → variant → session → JWT → audit
- **Implemented** `server/app/middleware/clerk_auth.py` — real Clerk JWKS verification + dev bypass + require_role() RBAC factory
- **Implemented** `server/app/middleware/edge_auth.py` — RS256 JWT verification for edge session tokens
- **Implemented** `server/app/api/edge/auth.py` — POST /auth/authenticate + POST /auth/supervisor-override
- **Created** `server/app/api/cloud/users.py` — GET /users/me + POST /users/sync (admin-only)
- **Extended** `server/app/schemas/auth.py` — SupervisorOverrideRequest/Response, UserMeResponse, UserSyncRequest/Response
- **Mounted** users router in `server/app/main.py`
- **Created** `tests/unit/test_auth.py` — 35 unit tests (JWT, QR token, face similarity, Clerk middleware)
- **Created** `tests/integration/test_auth_integration.py` — 7 integration tests (QR-only, QR+face, supervisor override)
- **Created** `tests/security/test_auth_security.py` — 21 security tests (T-007..T-012)
- **Created** `vault/03_Modules/Module03_Authentication/ManualTestingChecklist.md`
- **Results:** 282 total tests passing (all modules), 81% coverage Module 03, zero lint errors
- **Threats covered:** T-007 (replay), T-008 (tampered QR — 5 variants), T-009 (expired), T-010 (wrong key), T-011 (RBAC bypass), T-012 (face spoofing)

### 2026-06-10 — Module 02: Cryptographic Package Delivery (Complete)
- **Implemented** `shared/crypto/aes.py` — Full AES-256-GCM with fresh nonce per call, tamper detection via GCM auth tag
- **Implemented** `shared/crypto/rsa.py` — RSA-2048 PSS signing/verification + OAEP key wrapping
- **Implemented** `server/app/services/package_service.py` — generate, verify_signature, get_wrapped_key, download_payload
- **Implemented** `server/app/services/distribution_service.py` — D-012 admin-triggered key release, list packages, delivery status
- **Implemented** `server/app/api/cloud/packages.py` — 4 routes: generate, get, download, verify
- **Implemented** `server/app/api/cloud/distribution.py` — 2 routes: list packages, delivery status
- **Implemented** `server/app/api/cloud/exams.py` — added `POST /exams/{id}/release-key` (D-012)
- **Created** `server/app/schemas/packages.py` — full Pydantic schema set (8 models)
- **Created** `scripts/generate_keys.py` — RSA key pair bootstrap (server + center)
- **Created** `tests/unit/test_crypto.py` — 33 unit tests (AES, RSA, HashUtils)
- **Created** `tests/unit/test_package_service.py` — 13 unit tests (PackageService, mock DB)
- **Created** `tests/integration/test_package_integration.py` — 8 integration tests (full pipeline)
- **Created** `tests/security/test_package_security.py` — 15 security tests (T-001 through T-006)
- **Created** `vault/03_Modules/Module02_CryptoDelivery/ManualTestingChecklist.md`
- **Results:** 219 total tests passing (all modules), 92% coverage Module 02, zero lint errors
- **Threats covered:** T-001 (key correctness), T-002 (tampered payload), T-003 (tampered signature), T-004 (key isolation), T-005 (nonce uniqueness), T-006 (package opacity)

### 2026-06-10 — Module 05 Docs Updated
- Identified and confirmed Module 05 (State Recovery) was fully implemented by team member but undocumented
- Updated `CurrentState.md` to mark Module 05 as Complete

### 2026-06-09 — Module 05: State Recovery (Complete)
- **Implemented** `SnapshotManager` pure logic for building/verifying hashes.
- **Extended** `RecoverySnapshot` model with SQLite UPSERT semantics.
- **Implemented** `RecoveryService` for persisting answers and restoring state.
- **Implemented** Edge API routes for `/exam/answer`, `/exam/submit`, and `/recovery/*`.
- **Created** comprehensive test suite (58 tests: unit, integration, edge cases, security) with 99% coverage.
- **Created** `ManualTestingChecklist.md` for QA.

### 2026-06-09 — Module 07: Audit Ledger (Complete)
- **Implemented** `shared/audit/chain_verifier.py` — ChainVerifier.verify() with 3-check tamper detection
- **Extended** `server/app/models/audit_event.py` — Added exam_id, actor_role, target_id, synced columns
- **Implemented** `server/app/schemas/audit.py` — Full schema set: EventType (17 types), LogEventRequest, ChainVerificationResult, ExportResponse
- **Implemented** `server/app/services/audit_service.py` — log_event, get_chain, verify_chain, list_events, export_chain (JSON+CSV)
- **Implemented** `server/app/api/common/audit.py` — 8 FastAPI routes: log, chain, chain/{exam_id}, verify, verify/{exam_id}, events, export/{exam_id}, stats
- **Created** `tests/unit/test_audit.py` — 45 unit tests (ChainVerifier, HashChain, EventLogger, schema validation)
- **Created** `tests/integration/test_audit_integration.py` — 27 integration tests (SQLite in-memory)
- **Created** `tests/security/test_audit_security.py` — 15 security tests (T-009, T-008, T-004 coverage)
- **Created** `pytest.ini` — asyncio_mode=auto, coverage configuration
- **Updated** `tests/conftest.py` — Real RSA key pair generation, asyncio config
- **Results:** 87 tests passing, 98% coverage, zero lint errors, 10k events < 1s
- **Threats covered:** T-009 (6 tests), T-008 (2 tests), T-004 (2 tests)

- **Fixed** correct_option remapping: replaced `.index()` with inverse-permutation tracking (safe for duplicate option text)
- **Fixed** seed derivation: replaced arithmetic `seed * 10000 + id` with SHA-256 hash-based derivation (collision-resistant)
- **Fixed** `assign_variants()`: returns deep copies to prevent aliasing across seats sharing the same color
- **Added** input validation: `correct_option` bounds check and empty options check in `generate_variants()`
- **Added** duplicate seat ID validation in `from_coordinates()`
- **Renamed** `chromatic_number()` → `num_colors_used()` (mathematical accuracy — greedy coloring returns upper bound)
- **Removed** dead code branch in `num_colors_used()`
- **Fixed** 6 documentation drift items across vault files
- **Fixed** audit integration test: now tests actual `HashChain` linking, not just event creation
- Added 12 new edge case tests (53 total, up from 42)

### 2026-06-08 — Module 04: Graph Randomization
- Implemented `GraphBuilder` with grid and radius-based coordinate construction
- Implemented `GraphColoring` using NetworkX greedy coloring
- Implemented `VariantGenerator` with deterministic seeding and option shuffling
- Integrated audit event logging and hash chain linking for graph operations
- Added comprehensive unit, integration, and edge-case test suites (53 tests)

### 2026-06-08 — Vault Initialization

#### Added
- Complete Obsidian vault structure (40+ documents)
- Project overview with architecture analysis
- PRD summary and user stories (14 stories across 5 roles)
- Problem analysis with 6 failure mode breakdowns
- Architecture summary with zone/layer documentation
- Security model (4 defense layers, 5 cryptographic primitives)
- Data flow documentation (3 phases)
- Threat model (14 threats, STRIDE methodology)
- Service boundary definitions
- Deployment architecture (hackathon + production)
- ADR-001: Edge-First Architecture
- 7 module specifications with data models, APIs, algorithms
- Repository structure with directory responsibilities
- Backend and frontend design documents
- Database schema (PostgreSQL + SQLite)
- API contracts (cloud + edge)
- Environment setup and deployment guides
- Coding standards
- Sprint board (5 sprints, 50+ tasks)
- Active tasks, known issues, blockers, technical debt trackers
- Test plan, security tests, performance tests, regression tests
- AI context and handoff documentation
- Judge narrative, demo flow, FAQ, elevator pitch
- Success metrics and decision log (7 architecture decisions)

#### Status
- All planning and documentation phases complete
- Ready for Sprint 1: Core Backend + Crypto implementation

---

## Related Documents

- [[CurrentState]] — Live project status
- [[SprintBoard]] — Sprint progress
- [[ActiveTasks]] — Current work
