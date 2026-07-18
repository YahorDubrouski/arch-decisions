# For reviewers — Python backend

Short path to evaluate this **FastAPI** package without reading the whole monorepo.

---

## 5-minute path

1. **Read** [../README.md](../README.md) (overview + screenshots)  
2. **Run** `make docker-up` from monorepo root → open http://localhost:3002/docs  
3. **Skim** [architecture.md](./architecture.md) (providers + layout)  
4. **Open** [practices.md](./practices.md) — must-haves with proof links  
5. **Deep-dive code:**
   - [container.py](../src/arch_decisions/container.py)  
   - [workers/tasks.py](../src/arch_decisions/workers/tasks.py)  
   - [recommendation_provider_factory.py](../src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py) (fail loud)

Optional companion UI: http://localhost:5174 with `VITE_API_URL=http://localhost:3002`.

---

## What this demonstrates

| Theme | Evidence |
|-------|----------|
| Layered API | routes → services → infrastructure |
| Explicit configuration | Provider matrix; fail loud without API key |
| Async jobs | Celery worker; 202 + job polling |
| OpenAPI / Swagger | Pydantic schemas + sibling `*_docs.py`; `/docs` |
| Persistence | PostgreSQL + Alembic; domain ≠ ORM models |
| Tests | pytest unit + TestClient HTTP (~26 tests) |

Full checklist: [practices.md](./practices.md).

---

## Competency map (backend)

| # | Competency | Where |
|---|------------|-------|
| 1 | Clean / hexagonal layering | [domain/](../src/arch_decisions/domain/) · [services/](../src/arch_decisions/services/) · [infrastructure/](../src/arch_decisions/infrastructure/) |
| 2 | Composition root + Depends | [container.py](../src/arch_decisions/container.py) · [deps.py](../src/arch_decisions/api/deps.py) |
| 3 | Strategy / providers | Factories under [infrastructure/openai/](../src/arch_decisions/infrastructure/openai/) |
| 4 | Queue design | [celery_app.py](../src/arch_decisions/celery_app.py) · [workers/](../src/arch_decisions/workers/) |
| 5 | API contract + docs | [api/schemas/](../src/arch_decisions/api/schemas/) · FastAPI `/docs` |
| 6 | Reliability | [openai_gateway.py](../src/arch_decisions/infrastructure/openai/openai_gateway.py) retries |
| 7 | Observability basics | structlog + correlation ID |
| 8 | Schema migrations | [alembic/](../alembic/) |
