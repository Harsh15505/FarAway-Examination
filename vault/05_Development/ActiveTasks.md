# FortisExam — Active Tasks

> **Last Updated:** 2026-06-08
> **Current Sprint:** Sprint 0 (Foundation)

---

## 🟢 In Progress

| Task | Track | Assignee | Notes |
|---|---|---|---|
| ~~Vault creation~~ | Docs | AI Agent | ✅ Complete |
| ~~Architecture analysis~~ | Docs | AI Agent | ✅ Complete |
| ~~Sprint planning~~ | Docs | AI Agent | ✅ Complete |
| ~~Module 04: Graph Randomization~~ | Backend | AI Agent | ✅ Complete |

---

## 🔴 Ready for Sprint 1

### Backend Core (Start First)
- [ ] PostgreSQL schema design + Alembic migrations
- [ ] FastAPI cloud backend scaffold (`backend/app/main.py`)
- [ ] Question CRUD API (`backend/app/api/v1/questions.py`)
- [ ] Audit event logger (`backend/app/services/audit_service.py`)

### Security (Parallel with Backend)
- [ ] AES-256-GCM module (`shared/crypto/aes.py`)
- [ ] RSA-4096 module (`shared/crypto/rsa.py`)
- [ ] SHA-256 hash chain (`shared/audit/hash_chain.py`)
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
