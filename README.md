# Architecture Decisions Platform

A portfolio application that turns project context (team size, budget, compliance, traffic) into infrastructure recommendations and Architecture Decision Records (ADRs).

**Audience:** architects, senior engineers, and hiring managers evaluating system design — not a production SaaS product.

---

## What you get

1. **Context wizard** — structured input instead of free-text requirements  
2. **Recommendations** — compute, secrets, and CI/CD options with trade-offs  
3. **ADR workflow** — generate, store, view, copy, and export markdown decisions  

Stack: React 19 + TypeScript (Vite) · Node 24 + Express 5 · SQLite · Redis/BullMQ · optional OpenAI.

---

## Screenshots

| Home | Context |
|------|---------|
| ![Home](./docs/screenshots/01-home.png) | ![Context](./docs/screenshots/02-context.png) |

| Recommendations | Documents |
|-----------------|-----------|
| ![Recommendations](./docs/screenshots/03-recommendations.png) | ![Documents](./docs/screenshots/04-documents-grid.png) |

| ADR summary | ADR full |
|-------------|----------|
| ![Summary](./docs/screenshots/05-adr-summary.png) | ![Full](./docs/screenshots/06-adr-full.png) |

---

## Quick start

**Prerequisites:** Docker and Docker Compose.

```bash
make docker-up
```

| Service | URL |
|---------|-----|
| Frontend (dev) | http://localhost:5174 |
| API | http://localhost:3001 |
| Health | http://localhost:3001/health |

**Try the flow:** Home → Context (complete all 5 steps) → Recommendations → Generate ADR → open document from Documents.

Stop: `make docker-down`

Details (env vars, tests, frontend-only mode): [docs/getting-started.md](./docs/getting-started.md)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/getting-started.md](./docs/getting-started.md) | Run, test, verify provider matrix |
| [docs/architecture.md](./docs/architecture.md) | Key decisions, provider config, repo layout |
| [docs/reference.md](./docs/reference.md) | API endpoints and environment variables |
| [docs/frontend.md](./docs/frontend.md) | React structure for frontend reviewers |
| [docs/practices.md](./docs/practices.md) | **Must-have checklists + practice → code proof** (FE / BE / DevOps) |
| [docs/for-reviewers.md](./docs/for-reviewers.md) | 5-minute review path and competency map |
| [docs/examples/flows/full-journey.md](./docs/examples/flows/full-journey.md) | End-to-end walkthrough with sample payloads |

---

## Highlights (why this repo exists)

Full evidence list with file links: **[docs/practices.md](./docs/practices.md)**.

- **Explicit provider selection** — env chooses mock/OpenAI, template/OpenAI, HTTP/local; misconfig throws ([architecture.md](./docs/architecture.md#provider-configuration))  
- **Layered backend + BullMQ** — controllers → services → integrations; async jobs off the request  
- **Feature-based frontend** — correct state ownership; gateways swap data source without UI changes  
- **Tests** — 122 frontend + 35 backend; provider matrix smoke script  

---

## License

Portfolio / demonstration project.
