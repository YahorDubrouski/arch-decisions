# Architecture Decisions — Python backend

FastAPI implementation of the same HTTP contract as the Express backend: recommendations + ADR generation via `202` + job polling, provider matrix, Celery worker, PostgreSQL persistence.

Point the frontend here with `VITE_API_URL=http://localhost:3002`.

---

## Quick start (Docker)

From the **repo root**:

```bash
make docker-up
```

| Service | URL |
|---------|-----|
| Python API | http://localhost:3002 |
| Health | http://localhost:3002/health |
| Swagger UI | http://localhost:3002/docs |
| OpenAPI JSON | http://localhost:3002/openapi.json |

Express twin stays on http://localhost:3001 — see [../backend/README.md](../backend/README.md).

Copy env if needed: `.env.example` → `.env` (Compose may override `DATABASE_URL` / `REDIS_URL` from the root `.env`).

---

## Commands (inside the container)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python pytest
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python ruff check .
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python python scripts/verify_provider_matrix.py
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python alembic upgrade head
```

| Command | Purpose |
|---------|---------|
| `uvicorn arch_decisions.main:app --reload` | API (Compose default) |
| `celery -A arch_decisions.worker.celery_app worker` | Job worker |
| `pytest` | Unit + HTTP API tests |
| `python scripts/verify_provider_matrix.py` | Provider smoke (mock/template/openai) |
| `alembic upgrade head` | Migrations (also on API boot) |

---

## Layout

```text
src/arch_decisions/
├── api/             # routes, schemas, middleware, deps
├── core/            # config (by concern), logging, errors
├── domain/          # pure business types
├── services/        # use cases
├── infrastructure/  # db, openai, queue, storage
└── workers/         # Celery tasks
tests/
├── api/             # HTTP integration (TestClient), per domain
└── unit/            # factories, services, domain
```

Flow: `api/routes` → `services` → `infrastructure`.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [../docs/getting-started.md](../docs/getting-started.md) | Run, test, env setup |
| [../docs/architecture.md](../docs/architecture.md) | Providers, layout, workers |
| [../docs/reference.md](../docs/reference.md) | API + env vars + scripts |
| [../docs/practices.md](../docs/practices.md) | Senior FastAPI checklist with file proof |
| [../README.md](../README.md) | Product overview + screenshots |

---

## Stack

FastAPI · Pydantic v2 · SQLAlchemy 2 + Alembic · PostgreSQL · Celery + Redis · structlog · pytest · Ruff
