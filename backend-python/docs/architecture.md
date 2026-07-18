# Architecture — Python backend

## Overview

```text
Client (UI or curl)
  → FastAPI (:3002)
  → Redis (Celery broker + result backend)
  → Celery worker process
  → Providers (mock | OpenAI) + PostgreSQL | memory
```

Evaluate and generate return **202 + jobId**; clients poll `GET /api/jobs/:jobId` until completed.

Same HTTP contract as the Express twin so a frontend can switch via `VITE_API_URL`.

---

## Key decisions

| Area | Choice | Why |
|------|--------|-----|
| Runtime | Python 3.12 | Portfolio senior FastAPI stack |
| API | FastAPI + Pydantic v2 | Typed routes; built-in OpenAPI |
| Persistence | PostgreSQL + SQLAlchemy/Alembic (or memory) | Classical relational server |
| Async work | Celery + Redis | LLM / generation off the request |
| DI | Composition root + `Depends` | Explicit wiring without a heavy framework |
| Config | Domain-split settings under `core/config/` | One concern per module |
| AI | Optional, explicit env | Template/mock defaults; OpenAI opt-in |

---

## Provider configuration

Invalid values **raise**. OpenAI without `OPENAI_API_KEY` **raises** — no silent fallback.

| Layer | Variable | Values | Default |
|-------|----------|--------|---------|
| Recommendations | `RECOMMENDATION_PROVIDER` | `mock` \| `openai` | `mock` |
| ADR generator | `ARCHITECTURE_DECISION_GENERATOR_PROVIDER` | `template` \| `openai` | `template` |
| Storage | `STORAGE_PROVIDER` | `postgres` \| `memory` | `postgres` |

### Supported combinations (API)

| ID | Rec | ADR | Storage | Notes |
|----|-----|-----|---------|-------|
| B | mock | template | postgres | Default demo path |
| C | mock | template | memory | Stateless / tests |
| D–F | openai mixes | openai mixes | postgres | Needs `OPENAI_API_KEY` |
| G–H | openai without key | — | — | Must fail loud |

Verify: `python scripts/verify_provider_matrix.py` — see [getting-started.md](./getting-started.md).

**Code map:** [recommendation_provider_factory.py](../src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py) · [architecture_decision_provider_factory.py](../src/arch_decisions/infrastructure/openai/architecture_decision_provider_factory.py) · [architecture_decision_repository_factory.py](../src/arch_decisions/infrastructure/storage/architecture_decision_repository_factory.py)

---

## Package layout

```text
src/arch_decisions/
├── api/             # routes, schemas, middleware, deps
├── core/            # config, logging, errors
├── domain/          # pure business types
├── services/        # use cases
├── infrastructure/  # db, openai, queue, storage
└── workers/         # Celery tasks
tests/
├── api/             # HTTP integration (TestClient)
└── unit/
```

**Flow:** `api/routes` → `services` → `infrastructure`

---

## Production-oriented details

- Security headers, rate limit, correlation ID, central error handlers  
- Alembic on API boot; worker skips migrations  
- Domain models (Pydantic) separate from SQLAlchemy table models  

Env list: [reference.md](./reference.md).
