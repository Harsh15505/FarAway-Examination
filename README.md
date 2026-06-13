# FortisExam

> **Zero-Trust, Edge-First, Cryptographically Accountable Examination Infrastructure**

---

## 🚀 Live Hackathon Demo

* **Admin Portal (Cloud):** [https://far-away-examination.vercel.app](https://far-away-examination.vercel.app/)
* **Candidate Kiosk Mock (Edge):** [https://far-away-examination-kisok.vercel.app](https://far-away-examination-kisok.vercel.app/)

*(Note: The Kiosk is usually an air-gapped Electron app, but is hosted here as a web app for the judges' convenience!)*

---

## Quick Start

```bash
# 1. Clone and setup
git clone <repo-url> && cd fortis-exam
make setup    # installs deps, generates keys, starts Docker, seeds data

# 2. Start services
make demo     # starts cloud server, edge server, PostgreSQL

# 3. Run admin portal
make run-web  # opens http://localhost:5173

# 4. Run desktop kiosk
make run-desktop
```

## Architecture

```
                    ┌──────────────┐
                    │  Admin Portal │  (React + Clerk)
                    │  localhost:5173│
                    └──────┬───────┘
                           │ Clerk JWT
                    ┌──────▼───────┐
                    │ Cloud Server  │  (FastAPI --mode cloud)
                    │ localhost:8000│
                    │  PostgreSQL   │
                    └──────┬───────┘
                           │ Encrypted Package + Wrapped Key
                    ┌──────▼───────┐
                    │ Edge Server   │  (FastAPI --mode edge)
                    │ localhost:8001│
                    │   SQLite      │
                    └──────┬───────┘
                           │ Custom RSA JWT
                    ┌──────▼───────┐
                    │ Desktop Kiosk │  (Electron + React)
                    │  Kiosk Mode   │
                    └──────────────┘
```

## Project Structure

```
├── server/       # Single FastAPI app (cloud + edge modes)
├── shared/       # Shared Python libraries (crypto, audit, graph)
├── web/          # Admin portal (React + Vite + Clerk)
├── desktop/      # Candidate kiosk (Electron + React)
├── scripts/      # Automation (setup, seed, reset, keygen)
├── docker/       # Docker Compose + env template
├── tests/        # Unit, integration, security tests
├── docs/         # Source documents (PRD, TRD, Architecture)
└── vault/        # Project memory vault (Obsidian)
```

## Key Commands

| Command | Description |
|---|---|
| `make setup` | First-time setup |
| `make demo` | Start full demo environment |
| `make reset` | Reset demo to clean state |
| `make test` | Run all tests |
| `make run-web` | Start admin portal dev server |
| `make run-desktop` | Start desktop kiosk |
| `make clean` | Stop everything and remove data |

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Python 3.11 + FastAPI |
| Admin Auth | Clerk |
| Cloud DB | PostgreSQL 15 |
| Edge DB | SQLite (WAL mode) |
| Crypto | AES-256-GCM, RSA-2048, SHA-256 |
| Frontend | React 18 + TypeScript + Vite |
| Desktop | Electron 28 + React |
| Deployment | Docker Compose (3 containers) |

## Security Model

- **Layer 1:** Identity (Clerk for admin, QR + face for candidates)
- **Layer 2:** Content (AES-256-GCM encryption at rest)
- **Layer 3:** Execution (Electron kiosk mode lockdown)
- **Layer 4:** Audit (SHA-256 hash-chained tamper-evident ledger)

## License

Proprietary — Hackathon Project
