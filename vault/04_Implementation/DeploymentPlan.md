# FortisExam — Deployment Plan

> **Last Updated:** 2026-06-08

---

## Hackathon Deployment

### Single Machine Setup
All components run on one machine using Docker Compose + native Electron.

```bash
# Start cloud + edge services
docker compose -f infrastructure/docker-compose.yml up -d

# Services available:
# Cloud backend:  http://localhost:8000
# Edge server:    http://localhost:8001
# Admin portal:   http://localhost:3000
# PostgreSQL:     localhost:5432
# Redis (cloud):  localhost:6379
# Redis (edge):   localhost:6380

# Start desktop app
cd desktop && npm start
```

---

## Pre-Demo Checklist

- [ ] Docker services running
- [ ] Database migrated and seeded
- [ ] RSA keys generated
- [ ] Sample questions created (20+)
- [ ] Sample exam compiled
- [ ] Sample candidates registered with face embeddings
- [ ] Seating layout configured
- [ ] Electron app tested in kiosk mode
- [ ] Demo script rehearsed

---

## Related Documents

- [[EnvironmentSetup]] — Dev setup guide
- [[DeploymentArchitecture]] — Infrastructure design
- [[DemoFlow]] — Demo walkthrough
