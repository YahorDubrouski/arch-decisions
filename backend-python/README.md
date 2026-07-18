# Architecture Decisions — Python backend

FastAPI API that turns project context into infrastructure recommendations and Architecture Decision Records (ADRs).

**Audience:** hiring managers and engineers reviewing a **senior FastAPI backend** — layered services, Celery jobs, Pydantic/OpenAPI, fail-loud providers.

Same HTTP contract as the [Express twin](../backend/README.md) (`202` + job polling).

---

## What you get

1. **Evaluate recommendations** — `POST /api/recommendations/evaluate` → **202** + poll job  
2. **Generate ADRs** — `POST /api/architecture-decisions/generate` → **202** + persist  
3. **List / get decisions** — search + status filters  
4. **Swagger** — FastAPI OpenAPI at `/docs`

Stack: Python 3.12 · FastAPI · Pydantic v2 · SQLAlchemy 2 + Alembic · PostgreSQL (or memory) · Celery + Redis · structlog · pytest · Ruff · optional OpenAI.

---

## Screenshots

| Swagger | Recommendations (companion UI) |
|---------|--------------------------------|
| ![Swagger](./docs/screenshots/08-swagger-python.png) | ![Recommendations](./docs/screenshots/03-recommendations.png) |

| Documents | ADR full |
|-----------|----------|
| ![Documents](./docs/screenshots/04-documents-grid.png) | ![ADR](./docs/screenshots/06-adr-full.png) |

More: [docs/screenshots/](./docs/screenshots/).

---

## Quick start (Docker)

From the **monorepo root**:

```bash
make docker-up
```

| Service | URL |
|---------|-----|
| Python API | http://localhost:3002 |
| Health | http://localhost:3002/health |
| **Swagger UI** | http://localhost:3002/docs |
| OpenAPI JSON | http://localhost:3002/openapi.json |

Point companion UI: `VITE_API_URL=http://localhost:3002`.

Stop: `make docker-down`

Details: [docs/getting-started.md](./docs/getting-started.md)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/getting-started.md](./docs/getting-started.md) | Run, test, verify providers |
| [docs/architecture.md](./docs/architecture.md) | Decisions, providers, layout |
| [docs/reference.md](./docs/reference.md) | API, env, commands |
| [docs/practices.md](./docs/practices.md) | **Must-have checklist + code proof** |
| [docs/for-reviewers.md](./docs/for-reviewers.md) | 5-minute review path |
| [docs/screenshots/](./docs/screenshots/) | Swagger + companion UI |

---

## Highlights

- **Explicit provider selection** — mock/OpenAI, template/OpenAI, postgres/memory; misconfig fails loud  
- **Layered backend + Celery** — routes → services → infrastructure; async off the request  
- **Code-first OpenAPI** — Pydantic schemas + sibling `*_docs.py`  
- **Domain ≠ DB models** — Pydantic domain + SQLAlchemy tables  
- **Tests** — ~26 pytest tests (unit + TestClient HTTP)

Full evidence: [docs/practices.md](./docs/practices.md).

---

## Layout

```text
src/arch_decisions/
├── api/ core/ domain/ services/ infrastructure/ workers/
tests/
├── api/ unit/
```

Flow: `api/routes` → `services` → `infrastructure`.

---

## License

Portfolio / demonstration package (part of the arch-decisions monorepo).
