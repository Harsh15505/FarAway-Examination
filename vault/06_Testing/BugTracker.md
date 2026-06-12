# FortisExam — Bug Tracker

> **Last Updated:** 2026-06-12

---

## Active Bugs

> **All major backend gaps resolved.** Only BUG-003 (seed script) remains.

### BUG-001: Exam Create/List/Compile — Backend stubs return None

| Field | Value |
|---|---|
| **ID** | BUG-001 |
| **Severity** | Medium |
| **Module** | Backend — `server/app/api/cloud/exams.py` |
| **Status** | ✅ Fixed — 2026-06-12 |
| **Reported By** | AI QA / Phase 2b audit |
| **Reported On** | 2026-06-12 |

**Description:**
`POST /exams/`, `GET /exams/`, `GET /exams/{id}`, and `POST /exams/{id}/compile` all return `None` (Python stub `...` body). FastAPI serialises this as a 200 OK with empty body, causing the frontend to fall back to demo data.

**Reproduction Steps:**
1. Navigate to `/exams`
2. Click "New Exam", fill form, click "Create Exam"
3. Network tab shows `POST /api/v1/exams/` returns `200 null`

**Expected Behavior:**
Returns `{ id: "...", status: "created" }` and refreshes the table.

**Actual Behavior:**
Frontend shows error alert "Failed to create exam (backend stub — coming soon)".

**Root Cause:**
`exams.py` routes have `...` as their body — not implemented yet.

**Fix:**
Implement `create_exam()`, `list_exams()`, `get_exam()`, `compile_exam()` in `server/app/api/cloud/exams.py` using the `Exam` model and a new `ExamService`.

**Regression Test:**
Add to `tests/integration/test_exams_api.py` after fix.

---

### BUG-002: Center CRUD endpoints missing (GAP-1, GAP-2, GAP-3)

| Field | Value |
|---|---|
| **ID** | BUG-002 |
| **Severity** | Medium |
| **Module** | Backend — `server/app/api/cloud/centers.py` (missing file) |
| **Status** | ✅ Fixed — 2026-06-12 |
| **Reported By** | API Gap Analysis — Phase 2b |
| **Reported On** | 2026-06-12 |

**Description:**
`GET /centers`, `POST /centers`, `PUT /centers/{id}` are not implemented. The `Center` model exists in `server/app/models/center.py` but there are no routes, schema, or service for it.

**Reproduction Steps:**
1. Navigate to `/centers`
2. Click "Add Center", fill form, click "Add Center"
3. Network tab shows 404 on `POST /api/v1/centers`

**Expected Behavior:**
Center is created and appears in the table.

**Actual Behavior:**
Frontend catches the 404, shows "Demo mode — changes won't persist to DB" message (by design), simulates success.

**Root Cause:**
No `centers.py` router exists in `server/app/api/cloud/`.

**Fix:**
Create `server/app/api/cloud/centers.py` with CRUD routes + schema + register in `main.py`. The Center model already exists — just needs routes + service.

**Regression Test:**
Add `tests/integration/test_centers_api.py`.

---

### BUG-003: seed_test_data.py inserts fake/non-decryptable question data

| Field | Value |
|---|---|
| **ID** | BUG-003 |
| **Severity** | Low |
| **Module** | `server/seed_test_data.py` |
| **Status** | Known — Dev helper script only |
| **Reported By** | Phase 2b audit |
| **Reported On** | 2026-06-12 |

**Description:**
`seed_test_data.py` inserts questions with `encrypted_content="enc1"` which is not valid AES-256-GCM ciphertext. The list endpoint works fine (it never decrypts for listing), but `GET /questions/{id}` (which decrypts on read) will crash with a base64 decode error.

**Reproduction Steps:**
1. Run `python server/seed_test_data.py`
2. Call `GET /api/v1/questions/{id}` for any seeded question
3. 500 Internal Server Error — base64 decode fails on "enc1"

**Expected Behavior:**
Question decrypts and returns readable content.

**Actual Behavior:**
500 error on decrypt attempt.

**Root Cause:**
Seed script bypasses `QuestionService.create()` and inserts raw fake values.

**Fix:**
Rewrite `seed_test_data.py` to use `QuestionService.create()` so questions go through real AES-256-GCM encryption.

**Regression Test:**
Not needed — dev-only script, not covered by automated tests.

---

## Resolved Bugs

### BUG-F01: Question Save broken — type mismatch between frontend and backend

| Field | Value |
|---|---|
| **ID** | BUG-F01 |
| **Severity** | Critical |
| **Module** | `server/app/schemas/question.py`, `server/app/api/cloud/questions.py` |
| **Status** | ✅ Fixed — 2026-06-12 |
| **Reported By** | Phase 2b audit |
| **Fixed By** | AI Agent |

**Description:**
Frontend `QuestionCreateRequest` sent `options: {A,B,C,D}` dict and `correct_option: "B"` string, but backend `QuestionCreate` schema expected `options: list[str]` and `correct_option: int`. The mismatch caused every "Save & Encrypt" click to return `422 Unprocessable Entity`.

**Fix:**
- Updated `QuestionCreate` to accept `options: OptionsDict` (`{A,B,C,D}`) and `correct_option: str`
- Added `options_as_list()` and `correct_option_as_int()` helper methods for internal conversion
- Updated `list_questions()` to return `{items, total, page, page_size}` wrapper instead of plain list
- Updated `get_question()` to return `{A,B,C,D}` dict and letter string back to frontend
- Updated integration tests to new schema format (now 417 tests pass)

---

### BUG-F02: Dashboard stats endpoint (GAP-6) missing

| Field | Value |
|---|---|
| **ID** | BUG-F02 |
| **Severity** | Medium |
| **Module** | `server/app/api/cloud/dashboard.py` (new file) |
| **Status** | ✅ Fixed — 2026-06-12 |
| **Reported By** | Phase 2a audit |
| **Fixed By** | AI Agent |

**Description:**
`GET /dashboard/stats` endpoint didn't exist. Dashboard always showed demo data with yellow banner even when backend was fully running.

**Fix:**
Created `server/app/api/cloud/dashboard.py` with real DB aggregation queries (question count, exam count). Registered in `main.py`. Dashboard now shows real counts when backend is running.

---

### BUG-F03: Clerk JWKS URL was hardcoded to deprecated Clerk v1 URL

| Field | Value |
|---|---|
| **ID** | BUG-F03 |
| **Severity** | Critical |
| **Module** | `server/app/middleware/clerk_auth.py` |
| **Status** | ✅ Fixed — 2026-06-12 (by Ayaan) |
| **Reported By** | Authentication testing |
| **Fixed By** | Ayaan Goel |

**Description:**
`CLERK_JWKS_URL` was hardcoded to `https://api.clerk.dev/.well-known/jwks.json` (deprecated Clerk v1). Every JWT verification attempt returned 404, making authentication fail completely.

**Fix:**
Dynamic JWKS URL derivation by decoding the `CLERK_PUBLISHABLE_KEY` (base64 payload encodes the instance hostname). Falls back to hardcoded instance URL for this project.

---

### BUG-F04: Electron desktop app crashed with `require is not defined`

| Field | Value |
|---|---|
| **ID** | BUG-F04 |
| **Severity** | High |
| **Module** | `desktop/electron/main.js` → `main.cjs` |
| **Status** | ✅ Fixed — 2026-06-12 (by Ayaan) |
| **Reported By** | Desktop kiosk testing |
| **Fixed By** | Ayaan Goel |

**Description:**
`desktop/package.json` had `"type": "module"` but Electron's main process requires CommonJS. Caused `ReferenceError: require is not defined` on launch.

**Fix:**
Renamed `main.js` → `main.cjs`, `preload.js` → `preload.cjs`. Updated `package.json` entry point. Added `cross-env NODE_ENV=development` to dev script.

---

## Bug Report Template

### BUG-XXX: [Short title]

| Field | Value |
|---|---|
| **ID** | BUG-XXX |
| **Severity** | Critical / High / Medium / Low |
| **Module** | File path |
| **Status** | Open / In Progress / Fixed / Verified |
| **Reported By** | Name |
| **Reported On** | Date |

**Description:**
What is broken.

**Reproduction Steps:**
1. Step 1
2. Step 2

**Expected Behavior:**
What should happen.

**Actual Behavior:**
What actually happens.

**Root Cause:**
Why it broke (filled after investigation).

**Fix:**
What was changed.

---

## Related Documents

- `vault/06_Testing/TESTING_CHECKLIST.html` — Interactive QA checklist
- `vault/08_Frontend/ManualTestingChecklist.md` — Page-by-page status
- `vault/05_Development/KnownIssues.md` — Non-bug limitations
