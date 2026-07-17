# Architecture

## System overview

```text
Browser
  → React (gateways)
  → Express API  OR  FastAPI (Python)
  → Redis queue (BullMQ / Celery)
  → Worker process
  → Providers (mock | OpenAI) + SQLite|memory  /  PostgreSQL|memory
```

Evaluate and generate return **202 + jobId**; the client polls `GET /api/jobs/:jobId` until completed.

Both backends expose the **same HTTP contract** so the frontend can switch via `VITE_API_URL` (`:3001` Express, `:3002` Python).

---

## Key decisions

| Area | Express | Python | Why |
|------|---------|--------|-----|
| Runtime | Node 24 | Python 3.12 | Parallel senior stacks in one portfolio |
| API | Express 5 | FastAPI | Thin HTTP; typed routes + Pydantic |
| Persistence | SQLite + Knex | PostgreSQL + SQLAlchemy/Alembic | File DB vs classical relational server |
| Async work | BullMQ + Redis | Celery + Redis | API stays responsive; LLM off-request |
| DI | Awilix | composition root + `Depends` | Explicit wiring without magic |
| Frontend | React 19, feature folders | same | Shared UI against either API |
| AI | Optional, explicit env | same | Template/mock defaults; OpenAI opt-in |

---

## Provider configuration

Implementations are selected by **environment variables**. Invalid values throw. If config requests OpenAI without `OPENAI_API_KEY`, the app **throws** — it does not fall back to mock/template.

| Layer | Variable | Values | Default |
|-------|----------|--------|---------|
| Frontend I/O | `VITE_DATA_SOURCE` | `http` \| `local` | `http` |
| Recommendations | `RECOMMENDATION_PROVIDER` | `mock` \| `openai` | `mock` |
| ADR generator | `ARCHITECTURE_DECISION_GENERATOR_PROVIDER` | `template` \| `openai` | `template` |
| Storage | `STORAGE_PROVIDER` | Express: `sqlite` \| `memory` · Python: `postgres` \| `memory` | sqlite / postgres |

### Frontend (`VITE_DATA_SOURCE`)

| Value | Behaviour |
|-------|-----------|
| `http` | Gateways call the API (default Docker setup) |
| `local` | In-browser rules + template ADR + `sessionStorage` |

Hooks and pages do not branch on env — factories pick `Http*` or `Local*` gateways once.

### Supported combinations

When FE is `local`, backend provider env vars are unused for that session.

| ID | FE | Rec | ADR | Storage | Notes |
|----|----|-----|-----|---------|-------|
| A | local | — | — | — | Browser-only |
| B | http | mock | template | sqlite | Default hire/demo path |
| C | http | mock | template | memory | Stateless API |
| D–F | http | openai mixes | openai mixes | sqlite | Needs API key |
| G–H | http | openai without key | — | — | Must throw at startup |

Verify: `npm run verify:providers` (Express) or `python scripts/verify_provider_matrix.py` (Python) — see [getting-started.md](./getting-started.md).

**Code map (Express):** [dataSource.ts](../frontend/src/shared/config/dataSource.ts) · [recommendation-provider.config.ts](../backend/src/config/recommendation-provider.config.ts) · [recommendation-provider.factory.ts](../backend/src/integrations/openai/recommendation-provider.factory.ts) · [architecture-decision-provider.factory.ts](../backend/src/integrations/openai/architecture-decision-provider.factory.ts) · [architecture-decision-repository.factory.ts](../backend/src/integrations/storage/architecture-decision-repository.factory.ts)

**Code map (Python):** [recommendation_provider_factory.py](../backend-python/src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py) · [architecture_decision_provider_factory.py](../backend-python/src/arch_decisions/infrastructure/openai/architecture_decision_provider_factory.py) · [architecture_decision_repository_factory.py](../backend-python/src/arch_decisions/infrastructure/storage/architecture_decision_repository_factory.py)

---

## Repository layout

```text
arch-decisions/
├── frontend/src/
│   ├── app/           # Router, providers
│   ├── pages/         # Thin route screens
│   ├── features/      # context | recommendations | architecture-decisions
│   ├── domain/        # Shared types and pure rules
│   └── shared/        # API client, config, UI primitives
├── backend/src/                 # Express
│   ├── routes/ controllers/ services/ integrations/ jobs/ domain/
├── backend-python/src/arch_decisions/   # FastAPI (src layout)
│   ├── api/           # routes, deps, middleware
│   ├── core/          # config, logging, errors
│   ├── domain/        # pure business types
│   ├── services/      # use cases
│   ├── infrastructure/# db, openai, queue, storage
│   └── workers/       # Celery tasks
└── docs/
```

**Express flow:** `routes` → `controllers` → `services` → `integrations`  
**Python flow:** `api/routes` → `services` → `infrastructure`  
**Frontend flow:** `pages` → feature hooks → gateways → API or local adapters

---

## Production-oriented details

- **API hardening:** Helmet / security headers, JSON body limit, rate limit on `/api`, correlation ID (`x-request-id`), central error handler  
- **Express SQLite:** WAL + `busy_timeout` when API and worker share the DB file  
- **Python PostgreSQL:** Alembic migrations on API boot; worker sets `SKIP_DB_MIGRATIONS=1`  
- **Workers:** Express BullMQ / Python Celery; evaluate + generate off the request

Full env list: [reference.md](./reference.md).
