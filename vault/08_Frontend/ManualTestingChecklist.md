# FortisExam — Manual Testing Status & Bug Report

> **Last Updated:** 2026-06-12
> **Tested Phases:** Phase 1 (Foundation) & Phase 2a (Question Bank)
> **Testers:** User & AI QA Pair

---

## 🧪 Testing Scope
This document tracks the manual testing results for all **currently implemented** frontend pages. 
Any page not listed here (like Exams, Packages, Centers) is currently a blank stub waiting for Phase 2b development.

---

## 1. Dashboard (`/`)
**Status:** 🟡 Partially Working (Using Fake Data)
**Frontend File:** `web/src/pages/Dashboard.tsx`
**Wired Endpoints:** `dashboardApi.getStats()` → `GET /api/v1/dashboard/stats`

* **Issues & Missing Endpoints:**
  * **[GAP-6] Missing Backend Endpoint:** The `GET /dashboard/stats` endpoint has not been built in the backend yet (`server/app/api/cloud/dashboard.py` doesn't exist).
  * **Frontend Workaround:** The frontend catches the API error and automatically renders a `DEMO_STATS` object. So the page *looks* like it works, but the numbers (e.g., 1,248 questions, 8 centers) are entirely faked.
* **Remarks/Suggestions:**
  * Once the backend developer implements GAP-6, the frontend requires zero changes to work. It will automatically switch from fake data to real data.

---

## 2. Question Bank List (`/questions`)
**Status:** 🟡 Blocked / Pending Data
**Frontend File:** `web/src/pages/Questions.tsx`
**Wired Endpoints:** 
  * `questionsApi.list()` → `GET /api/v1/questions`
  * `questionsApi.delete()` → `DELETE /api/v1/questions/{id}`

* **Issues & Missing Endpoints:**
  * Cannot fully test the list functionality (search, filter, graph) because there are no questions currently imported in the backend.
* **Remarks/Suggestions:**
  * Testing is paused for this section. Once questions are properly imported into the backend, we can resume testing the table features.

---

## 3. Question Editor (`/questions/new` and `/questions/:id/edit`)
**Status:** 🔴 Broken / Partially Working
**Frontend File:** `web/src/pages/QuestionEditor.tsx`
**Wired Endpoints:** 
  * `questionsApi.create()` → `POST /api/v1/questions`
  * `questionsApi.get()` → `GET /api/v1/questions/{id}`
  * `questionsApi.update()` → `PUT /api/v1/questions/{id}`

* **Issues & Missing Endpoints:**
  * **Save is broken:** When clicking "Add Question", it shows a sample question, but the "Save as Draft" and "Save & Encrypt" buttons do not work (cannot save the question to the backend).
* **Remarks/Suggestions:**
  * **Feature Working:** The "SHA-256 Hash" live generation and the "copied to clipboard" feature are successfully working on the UI side.
  * The form submission requires debugging to figure out why the backend is rejecting the save request.

---

## 📋 Teammate Action Items
If a teammate is picking up testing here:
1. **Do not test** Exams, Packages, or Centers. They are blank UI stubs (`Exams.tsx` is literally 12 lines of code).
2. Look at `ActiveTasks.md` and `BackendGaps.md` — the backend developer needs to finish **GAP-1, GAP-2, and GAP-3** before the next frontend phase (Phase 2b) can be coded.
