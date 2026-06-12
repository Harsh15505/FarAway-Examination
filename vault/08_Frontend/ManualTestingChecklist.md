# FortisExam — Manual Testing Status & Bug Report

> **Last Updated:** 2026-06-12
> **Tested Phases:** Phase 1 (Foundation), Phase 2a (Question Bank), Phase 2b (Exams / Packages / Distribution / Centers / Users)
> **Testers:** QA Team

---

## 🚀 Quick Start for Testers

Before running any test:

```bash
# Terminal 1 — Backend (from d:\DelhiHackathon)
python -m uvicorn server.app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Frontend (from d:\DelhiHackathon\web)
npm run dev
```

Then open the **interactive checklist** in your browser:
```
d:\DelhiHackathon\vault\06_Testing\TESTING_CHECKLIST.html
```
> The HTML checklist has Pass / Fail / Skip buttons with progress tracking, filters, and a copy-report feature. Use it to log results.

| URL | Purpose |
|---|---|
| http://localhost:5173 | Admin Portal (main thing to test) |
| http://localhost:8000/docs | Swagger API docs (backend test) |
| http://localhost:8000/health | Backend health check |

---

## ⚠️ Important Context for Testers

### Demo Data vs. Real Data
Most Phase 2b pages show a **yellow banner** at the top:
> "Showing demo data — backend DB not running."

This is **expected** and is NOT a bug. The pages fall back to pre-defined demo data when the backend API returns an error. When the backend is running and the DB has data, the yellow banner disappears and real data loads.

**Rule for testers:**
- ✅ PASS: Page renders with demo data + yellow banner, modals open, buttons work
- ❌ FAIL: Page crashes, shows white screen, modal doesn't open, layout is broken
- ✅ PASS: Network request fires (even if backend returns an error)
- ❌ FAIL: Clicking a button does nothing at all (no network request, no UI feedback)

---

## 1. Dashboard (`/`)
**Status:** ✅ Working (GAP-6 now implemented)
**Frontend File:** `web/src/pages/Dashboard.tsx`
**Wired Endpoints:** `GET /api/v1/dashboard/stats`

**What changed:** Backend `GET /dashboard/stats` endpoint was added in Phase 2b — Dashboard now loads real question/exam counts from the DB instead of hardcoded demo numbers.

**Test checklist:** D-01 through D-09 in `TESTING_CHECKLIST.html`

---

## 2. Question Bank List (`/questions`)
**Status:** ✅ Working (real API wired)
**Frontend File:** `web/src/pages/Questions.tsx`
**Wired Endpoints:**
- `GET /api/v1/questions` — list with `{items, total, page, page_size}` wrapper
- `DELETE /api/v1/questions/{id}` — soft delete

**Test checklist:** Q-01 through Q-13 in `TESTING_CHECKLIST.html`

---

## 3. Question Editor (`/questions/new`, `/questions/:id/edit`)
**Status:** ✅ Fixed — Save now works correctly
**Frontend File:** `web/src/pages/QuestionEditor.tsx`
**Wired Endpoints:**
- `POST /api/v1/questions/` — create
- `GET /api/v1/questions/{id}` — load for edit
- `PUT /api/v1/questions/{id}` — update

**What was fixed:** The backend schema mismatch is resolved. Frontend sends `options: {A,B,C,D}` dict and `correct_option: "B"` (letter). Backend now correctly accepts and converts these formats.

**Test checklist:** E-01 through E-10 in `TESTING_CHECKLIST.html`

---

## 4. Exam Builder (`/exams`)
**Status:** 🟡 UI Complete — Backend Create/List are stubs
**Frontend File:** `web/src/pages/Exams.tsx`
**Wired Endpoints:**
- `GET /api/v1/exams/` — list (backend returns stub/None — demo data shown)
- `POST /api/v1/exams/` — create (backend is a stub — error expected)
- `POST /api/v1/exams/{id}/compile` — compile (backend stub)
- `POST /api/v1/exams/{id}/release-key` — ✅ **FULLY IMPLEMENTED** (RSA key wrapping works)

**What to test:**
- Blueprint builder UI (Add Row, remove row, counts update)
- Create exam modal opens and fires a network request
- Release Key modal opens correctly with RSA PEM textarea and warning alert
- Demo exam table renders with correct status badges

**Test checklist:** EX-01 through EX-14 in `TESTING_CHECKLIST.html`

---

## 5. Package Management (`/packages`)
**Status:** 🟡 UI Complete — Verify and Download are real
**Frontend File:** `web/src/pages/Packages.tsx`
**Wired Endpoints:**
- `GET /api/v1/distribution/packages` — list (demo fallback)
- `POST /api/v1/packages/{id}/verify` — ✅ **REAL** (RSA signature verification)
- `GET /api/v1/packages/{id}/download` — ✅ **REAL** (encrypted payload download)

**What to test:**
- Package list loads with demo data
- Click "Verify" — network request fires, result card appears at bottom
- Download icon triggers file save
- After verify, row button changes to Valid/Tampered badge

**Test checklist:** PK-01 through PK-11 in `TESTING_CHECKLIST.html`

---

## 6. Distribution & Key Release (`/distribution`)
**Status:** 🟡 UI Complete — Read-only (no write endpoints)
**Frontend File:** `web/src/pages/Distribution.tsx`
**Wired Endpoints:**
- `GET /api/v1/distribution/packages` — list packages with status (demo fallback)

**What to test:**
- 3 demo packages with center names show in table
- Progress timeline circles render correctly (filled = completed stage)
- Workflow guide card visible at bottom (3 steps)

**Test checklist:** DI-01 through DI-09 in `TESTING_CHECKLIST.html`

---

## 7. Center Management (`/centers`)
**Status:** 🟡 UI Complete — Backend CRUD (GAP-1/2/3) not yet implemented
**Frontend File:** `web/src/pages/Centers.tsx`
**Wired Endpoints:**
- `GET /api/v1/centers` — ⚠️ GAP-1 (not yet built, demo fallback)
- `POST /api/v1/centers` — ⚠️ GAP-2 (not yet built, demo simulates)
- `PUT /api/v1/centers/{id}` — ⚠️ GAP-3 (not yet built)

**What to test:**
- 5 demo centers load with search, risk bars, seat counts
- Search box filters live by name or city
- Add Center modal opens with all fields (Indian states dropdown)
- Edit modal opens pre-populated
- Delete confirm dialog works
- Demo mode badge shows in modal

**Test checklist:** CE-01 through CE-14 in `TESTING_CHECKLIST.html`

---

## 8. User & Role Management (`/users`)
**Status:** ✅ Working (profile loads from real Clerk JWT)
**Frontend File:** `web/src/pages/Users.tsx`
**Wired Endpoints:**
- `GET /api/v1/users/me` — ✅ **REAL** (returns from Clerk JWT claims)
- `POST /api/v1/users/sync` — ✅ **REAL** (syncs Clerk user to local DB)

**What to test:**
- Your Clerk profile card renders with correct name and role
- Team members table shows Harsh + Ayaan with role badges
- Sync User modal opens with Clerk ID / Name / Role fields
- Role description updates when role selector changes
- Role Permissions guide card at bottom has all 5 roles

**Test checklist:** U-01 through U-11 in `TESTING_CHECKLIST.html`

---

## 📋 Known Issues & Notes

| # | Page | Issue | Severity | Status |
|---|---|---|---|---|
| KI-1 | Exams | `POST /exams/` returns `None` (stub) — create fires but shows error | Medium | Known — backend stub |
| KI-2 | Packages | Verify fires but may 404 for demo package IDs that don't exist in DB | Low | Expected (demo IDs) |
| KI-3 | Centers | All CRUD fires to GAP-1/2/3 endpoints that don't exist yet | Medium | Known — GAP pending |
| KI-4 | Dashboard | Stats show real counts only when backend DB has data | Low | By design |
| KI-5 | All Phase 2b | Yellow "Showing demo data" banner appears when backend returns error | Info | Expected behaviour |

---

## 📋 Teammate Action Items

### Tester 1 — Focus: Phase 1 + 2a regression
Test categories: **Infra (I-xx), Auth (A-xx), Navigation (N-xx), Dashboard (D-xx), Question Bank (Q-xx), Question Editor (E-xx)**

### Tester 2 — Focus: Phase 2b new pages
Test categories: **Exam Builder (EX-xx), Packages (PK-xx), Distribution (DI-xx), Centers (CE-xx), Users (U-xx)**

After each session, use the **📋 Copy Report** button in the HTML checklist to copy results and paste into the team chat.

---

## 🐛 Reporting a Bug

When you find a real failure (not a known issue), add it to `vault/06_Testing/BugTracker.md` using the template:

```
### BUG-XXX: [Short title]
- **Page:** /route
- **Test ID:** XX-00
- **Steps:** What you did
- **Expected:** What should happen
- **Actual:** What happened instead
- **Severity:** Critical / High / Medium / Low
- **Screenshot/Note:** Optional
```
