# FortisExam — Active Tasks

> **Last Updated:** 2026-06-10
> **Current Sprint:** Sprint 1 (Backend & Crypto)

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
| ~~Module 02 & 03 Test Hardening~~ | QA | ayaan-goel | ✅ 354 total tests, fixed warnings, +11 new tests |
| ~~Module 01: Question Pool~~ | Backend | AI Agent | ✅ Complete (12 tests, Alembic schema, CRUD) |

---

## 🔴 Ready for Sprint 1

### Backend Core (Start First)
- [x] ~~PostgreSQL schema design + Alembic migrations~~ — Complete (Module 01)
- [ ] FastAPI cloud backend scaffold (`backend/app/main.py`)
- [x] ~~Question CRUD API (`backend/app/api/v1/questions.py`)~~ — Complete (Module 01)
- [x] ~~Audit event logger (`backend/app/services/audit_service.py`)~~ — Module 07 complete

### Security (Parallel with Backend)
- [x] ~~AES-256-GCM module (`shared/crypto/aes.py`)~~ — complete (Module 02)
- [x] ~~RSA-2048 module (`shared/crypto/rsa.py`)~~ — complete (Module 02)
- [x] ~~SHA-256 hash chain (`shared/audit/hash_chain.py`)~~ — complete
- [x] ~~Chain verifier (`shared/audit/chain_verifier.py`)~~ — complete (Module 07)
- [x] ~~JWT handler (`shared/crypto/jwt_handler.py`)~~ — complete (Module 03)
- [x] ~~Unit tests for all crypto modules~~ — 33 tests (Module 02)

### Infrastructure
- [ ] Docker Compose initial setup
- [ ] `.env` configuration
- [x] ~~RSA key generation script~~ — `scripts/generate_keys.py` (Module 02)

---

## 🟧 IN PROGRESS
* None

## 📝 TODO (Immediate Next)
* Edge server scaffold and wiring components

---

## 🔵 Blocked

None currently.

---

## 📋 Backlog (Sprint 2+)

- Exam compilation service
- Package generation + signing
- Edge server scaffold
- QR token flow
- Face verification
- Electron app scaffold
- Exam UI components
- State recovery system
- MediaPipe monitoring
- Admin + Proctor dashboards

---

## Related Documents

- [[SprintBoard]] — Full sprint breakdown
- [[TeamAssignments]] — Who does what
- [[Blockers]] — Active blockers
- [[KnownIssues]] — Known issues
