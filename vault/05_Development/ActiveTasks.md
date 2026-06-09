# FortisExam — Active Tasks

> **Last Updated:** 2026-06-09
> **Current Sprint:** Sprint 1 (Backend & Crypto)

---

## 🟢 Completed

| Task | Track | Assignee | Notes |
|---|---|---|---|
| ~~Vault creation~~ | Docs | AI Agent | ✅ Complete |
| ~~Architecture analysis~~ | Docs | AI Agent | ✅ Complete |
| ~~Sprint planning~~ | Docs | AI Agent | ✅ Complete |
| ~~Module 04: Graph Randomization~~ | Backend | AI Agent | ✅ Complete |
| ~~Module 07: Audit Ledger~~ | Backend | AI Agent | ✅ 87 tests, 98% coverage |

---

## 🔴 Ready for Sprint 1

### Backend Core (Start First)
- [ ] PostgreSQL schema design + Alembic migrations
- [ ] FastAPI cloud backend scaffold (`backend/app/main.py`)
- [ ] Question CRUD API (`backend/app/api/v1/questions.py`)
- [x] ~~Audit event logger (`backend/app/services/audit_service.py`)~~ — Module 07 complete

### Security (Parallel with Backend)
- [ ] AES-256-GCM module (`shared/crypto/aes.py`)
- [ ] RSA-2048 module (`shared/crypto/rsa.py`)
- [x] ~~SHA-256 hash chain (`shared/audit/hash_chain.py`)~~ — complete
- [x] ~~Chain verifier (`shared/audit/chain_verifier.py`)~~ — complete (Module 07)
- [ ] JWT handler (`shared/crypto/jwt_handler.py`)
- [ ] Unit tests for all crypto modules

### Infrastructure
- [ ] Docker Compose initial setup
- [ ] `.env` configuration
- [ ] RSA key generation script

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
