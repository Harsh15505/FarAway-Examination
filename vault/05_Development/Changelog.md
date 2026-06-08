# FortisExam — Changelog

> **Last Updated:** 2026-06-08

---

## [Unreleased]

### 2026-06-08 — Module 04: Review Fixes
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
