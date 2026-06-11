# FortisExam — Stitch Screen Registry

> **Last Updated:** 2026-06-11
> **Total Screens:** 36 across 7 Stitch workspaces
> **MCP Key:** Same key works for all projects (account-level auth)

---

## Quick Reference — Project → Role Mapping

| # | Stitch Project ID | Project Title | Role / Area | Screens |
|---|---|---|---|---|
| P1 | `3566420274227547466` | FortisExam Admin Dashboard | Admin (Authority) | 9 |
| P2 | `7086732234025588543` | FortisExam Center Management Platform | Center Admin / Proctor | 6 |
| P3 | `11845015599535963287` | *(Audit & Invigilator)* | Auditor / Invigilator | 7 |
| P4 | `14992230594034836227` | *(Expert & Center Admin)* | Expert / Center Admin | 4 |
| P5 | `8444012187030138194` | *(Candidate Auth Flow)* | Candidate (Kiosk) | 4 |
| P6 | `17817604031732273398` | *(Candidate Exam Taking)* | Candidate (Kiosk) | 4 |
| P7 | `18220513383148636895` | *(Candidate Submission & Recovery)* | Candidate (Kiosk) | 5 |

---

## Design System Constants (shared across all projects)

- **Font:** Inter (all weights)
- **Primary Blue:** `#1E40AF`
- **Primary Dark (Sidebar):** `#1E293B`
- **AI Purple:** `#7C3AED`
- **Surface Gray:** `#F8FAFC`
- **Border:** `#E2E8F0`
- **Roundness:** 4-8px (cards 8px, buttons 6px, badges 4px)
- **Sidebar:** 240px fixed
- **Topbar:** 64px fixed
- **Spacing base:** 8px grid

---

## Full Screen Inventory

### P1: FortisExam Admin Dashboard (`3566420274227547466`)

| Screen ID | Stitch Screen Title | Maps To | Phase | Platform |
|---|---|---|---|---|
| `a9de099f2b0742faa0c2e19cf09c09c1` | Main Overview Dashboard | **A1** — Admin Dashboard | Phase 2a | `web/` |
| `8cbb6f7ed25b45ba94042545289cf60c` | Question Bank List | **A2** — Question Bank | Phase 2a | `web/` |
| `73af486ee8ea42389398486ee1d7bbcd` | Question Editor | **A3** — Question Editor | Phase 2a | `web/` |
| `e8434cefeb92473f93379872815a4e02` | Exam List Dashboard | **A4a** — Exam List | Phase 2b | `web/` |
| `8b59cad087c248249cb0078a9635e525` | Exam Blueprint Configurator | **A4b** — Exam Builder | Phase 2b | `web/` |
| `077b97baf6be4e37b58cbb3186184894` | Exam Status Timeline Modal | **A6** — Distribution Timeline | Phase 2b | `web/` |
| `ead30cc06c924c42a7e09fa9cc8d3134` | Exam Package Manifest | **A5** — Package Management | Phase 2b | `web/` |
| `bfbeb3ca619c4cf3a2eb1279ab7c5555` | Center Risk Heatmap Full View | **EXTRA** — Risk Heatmap | Phase 4+ | `web/` |
| `44b832abcb0d42c991a2b976f9b2891c` | AI Normalization Report | **EXTRA** — AI Analytics | Phase 4+ | `web/` |

---

### P2: FortisExam Center Management Platform (`7086732234025588543`)

| Screen ID | Stitch Screen Title | Maps To | Phase | Platform |
|---|---|---|---|---|
| `1c67a52c3fea4f6fbe5c9e9934b3bb18` | Center Management List | **A7a** — Center List | Phase 2b | `web/` |
| `e8734105bf4f42669c15bcad00dba601` | Center Detail & Seating Builder | **A7b** — Center Detail/Edit | Phase 2b | `web/` |
| `03fae4e750f14b99974f24efd20e3b58` | Live Monitoring — National Overview | **D1** — Proctor Dashboard | Phase 4 | `web/` |
| `5eff0db203444a10b2307b1b28e98010` | Center Drill-Down — Live View | **D1b** — Per-Center Live View | Phase 4 | `web/` |
| `c914826676f1451182e9bf6fe3fce621` | Anomaly Detail Drawer | **D2** — Alert Detail Drawer | Phase 4 | `web/` |
| `10ed8a7356ae4d108ddb706e4b37a4ca` | Center Risk Report | **EXTRA** — Risk Report | Phase 4+ | `web/` |

---

### P3: Audit & Invigilator Screens (`11845015599535963287`)

| Screen ID | Stitch Screen Title | Maps To | Phase | Platform |
|---|---|---|---|---|
| `17a36f2c8a1e4334b2675bce022c0684` | Audit Explorer - FortisExam | **B1** — Audit Trail (Admin view) | Phase 4 | `web/` |
| `bca5af3b62094e94aeb6b6cb863ac33c` | Audit Explorer - Auditor | **B2** — Audit Trail (Auditor view) | Phase 4 | `web/` |
| `bde218c7fc944a06b1b8399c514dacb6` | Tamper Detection Alert - FortisExam | **B3** — Tamper Detection Demo | Phase 5 | `web/` |
| `1b7037891a2c4198a451385479cb1da7` | Export Report - Auditor | **B4** — Audit Export | Phase 4 | `web/` |
| `e29a70bc1c8347f88bced3bdd452277c` | Leak Monitor - FortisExam | **EXTRA** — Leak Monitor | Phase 4+ | `web/` |
| `3fbfb2e838044f688309ccce258f0bfa` | Auth Station - Invigilator | **D3a** — Invigilator Auth Station | Phase 4 | `web/` |
| `764becc1d8604655bc8c20b64465a1ab` | Supervisor Override Form - Invigilator | **D3b** — Supervisor Override | Phase 4 | `web/` |

---

### P4: Expert & Center Admin Screens (`14992230594034836227`)

| Screen ID | Stitch Screen Title | Maps To | Phase | Platform |
|---|---|---|---|---|
| `68fc7cf9287e4a8fa91f52935ff38e32` | Expert - My Questions | **A2-expert** — Expert Question List | Phase 2a | `web/` |
| `31f4486ed3ea48239a8ea4160e9b5668` | Expert - Question Editor & AI Normalizer | **A3-expert** — Expert Editor + AI | Phase 2a | `web/` |
| `45eca4cf6e8f476ba2fd5b05816170ce` | Center Admin - Overview | **A7c** — Center Admin Dashboard | Phase 2b | `web/` |
| `94be3c3e39b447eab4e8ad03d50b8e44` | Center Admin - Live Monitoring | **D1-center** — Center-level Monitoring | Phase 4 | `web/` |

---

### P5: Candidate Auth Flow (`8444012187030138194`)

| Screen ID | Stitch Screen Title | Maps To | Phase | Platform |
|---|---|---|---|---|
| `320efbaf0cb44b8bae1d5c282b76c3a5` | System Ready Splash | **C0** — Kiosk Splash Screen | Phase 3a | `desktop/` |
| `3d4d0c6a2c484740ae0f4abb7ce9265f` | Step 1: QR Verification | **C1** — QR Scan/Login | Phase 3a | `desktop/` |
| `2e3f1a6023bd4d3f8cd8b7d6a7b3fb6f` | Step 2: Face Verification | **C2** — Face Verification | Phase 3a | `desktop/` |
| `a62f79ad806d43d299aac1ad4099f23c` | Step 3: Seat Confirmation | **C3** — Seat Confirm/Waiting | Phase 3a | `desktop/` |

---

### P6: Candidate Exam Taking (`17817604031732273398`)

| Screen ID | Stitch Screen Title | Maps To | Phase | Platform |
|---|---|---|---|---|
| `27b6b5ddcdfb4168b5ac7de77b5abc04` | General Instructions | **C3b** — Exam Instructions | Phase 3b | `desktop/` |
| `f37ddafa105b4ba19ab879a911d1d6f1` | Section Transition | **C3c** — Section Transition | Phase 3b | `desktop/` |
| `9fc5c87266ab46a2a5b2791f0cad0210` | Active Exam - MCQ Question | **C4a** — MCQ Question UI | Phase 3b | `desktop/` |
| `64a4dc1318614e2ea37d37f684a80679` | Active Exam - Numerical Question | **C4b** — Numerical Question UI | Phase 3b | `desktop/` |

---

### P7: Candidate Submission & Recovery (`18220513383148636895`)

| Screen ID | Stitch Screen Title | Maps To | Phase | Platform |
|---|---|---|---|---|
| `8d5841bbf5a94d718c4f0464d392ffe0` | Auto-Submit Transition | **C5a** — Auto-Submit Timer | Phase 3b | `desktop/` |
| `7e162449d4d7421e87150be8f231572e` | Submission Confirmed | **C6a** — Submission Confirmed | Phase 3b | `desktop/` |
| `e2d849632f1148909879077e3787b00e` | Official Submission Confirmed | **C6b** — Official Confirmation | Phase 3b | `desktop/` |
| `70b6a7c08d54417e838fe3a2f21902e3` | Candidate Feedback Form | **C6c** — Post-Exam Feedback | Phase 3b | `desktop/` |
| `16e257603fb548058711c0b1096acc84` | Session Crash Recovery | **C7** — Crash Recovery | Phase 3b | `desktop/` |

---

## Phase → Stitch Screens Quick Lookup

### Phase 2a (Dashboard + Questions) — 5 screens
- P1: `a9de099f...` (Main Dashboard), `8cbb6f7e...` (Question Bank), `73af486e...` (Question Editor)
- P4: `68fc7cf9...` (Expert Questions), `31f4486e...` (Expert Editor + AI)

### Phase 2b (Exams + Packages + Centers) — 7 screens
- P1: `e8434cef...` (Exam List), `8b59cad0...` (Blueprint Configurator), `077b97ba...` (Status Timeline), `ead30cc0...` (Package Manifest)
- P2: `1c67a52c...` (Center List), `e8734105...` (Center Detail)
- P4: `45eca4cf...` (Center Admin Overview)

### Phase 3a (Candidate Auth) — 4 screens
- P5: `320efbaf...` (Splash), `3d4d0c6a...` (QR), `2e3f1a60...` (Face), `a62f79ad...` (Seat Confirm)

### Phase 3b (Candidate Exam + Submit + Recovery) — 9 screens
- P6: `27b6b5dd...` (Instructions), `f37ddafa...` (Section Transition), `9fc5c872...` (MCQ), `64a4dc13...` (Numerical)
- P7: `8d5841bb...` (Auto-Submit), `7e162449...` (Submitted), `e2d84963...` (Official Confirm), `70b6a7c0...` (Feedback), `16e25760...` (Recovery)

### Phase 4 (Audit + Proctor) — 11 screens
- P3: `17a36f2c...` (Audit Admin), `bca5af3b...` (Audit Auditor), `1b703789...` (Export), `e29a70bc...` (Leak Monitor), `3fbfb2e8...` (Auth Station), `764becc1...` (Supervisor Override)
- P2: `03fae4e7...` (National Monitor), `5eff0db2...` (Center Drill-Down), `c9148266...` (Anomaly Drawer)
- P4: `94be3c3e...` (Center Live Monitor)
- P1: `bfbeb3ca...` (Risk Heatmap)

### Phase 5 (Demo Polish) — 1 screen
- P3: `bde218c7...` (Tamper Detection)

---

## MCP Usage — How to Fetch a Screen

```
# List screens in a project
list_screens(projectId="3566420274227547466")

# Get full screen detail (HTML, screenshot, etc.)
get_screen(name="projects/3566420274227547466/screens/a9de099f2b0742faa0c2e19cf09c09c1")

# Generate implementation prompt from a screen
generate_screen_from_text(...)  # Use the screen's HTML export
```

> **Note:** The same MCP API key authenticates across all 7 projects. No per-project keys needed.
