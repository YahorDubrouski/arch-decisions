# Reference — Python backend

## API

| | |
|--|--|
| Base URL (Docker) | `http://localhost:3002` |
| Swagger UI | http://localhost:3002/docs |
| OpenAPI JSON | http://localhost:3002/openapi.json |

OpenAPI is **code-first** from FastAPI + Pydantic: shared schemas in [api/schemas/](../src/arch_decisions/api/schemas/); each endpoint’s Swagger narrative is a sibling `*_docs.py` (e.g. [architecture_decisions_generate_docs.py](../src/arch_decisions/api/routes/architecture_decisions_generate_docs.py)).

### Swagger screenshot

![Python Swagger](./screenshots/08-swagger-python.png)

---

### Health

`GET /health` → `{ "status": "ok", "message": "..." }`

### Recommendations

`POST /api/recommendations/evaluate`

Body: `{ "context": ProjectContext }` (or raw context object).

Response: **202** `{ "jobId": "..." }` — poll job until `completed`, then read `result`.

### Architecture decisions

`POST /api/architecture-decisions/generate`

Body: `{ "context": ProjectContext, "recommendations": RecommendationsResponse }`

Response: **202** `{ "jobId": "..." }`

`GET /api/architecture-decisions?search=&status=` → `{ "architectureDecisions": [...] }`

`GET /api/architecture-decisions/:decisionId` → `{ "architectureDecision": { ... } }`

### Jobs

`GET /api/jobs/:jobId` → `{ "job": { "jobId", "type", "status", "result?", "error?" } }`

Statuses: `waiting`, `active`, `completed`, `failed`, `delayed`, `unknown`.

Errors include `correlationId` when available.

---

## ProjectContext

```json
{
  "teamSize": "1-5 | 6-20 | 21-50 | 50+",
  "trafficPattern": "low-steady | variable | high-spike",
  "budgetSensitivity": "cost-optimized | balanced | performance-first",
  "complianceRequirements": ["SOC2", "HIPAA", "GDPR", "PCI-DSS"],
  "operationalMaturity": "minimal | moderate | mature"
}
```

---

## Environment variables (`backend-python/.env`)

| Variable | Default | Purpose |
|----------|---------|---------|
| `APP_ENV` | development | Runtime mode |
| `PORT` | 3000 | API port inside container |
| `DATABASE_URL` | postgres URL | SQLAlchemy / Alembic DSN |
| `STORAGE_PROVIDER` | postgres | `postgres` \| `memory` |
| `LOG_LEVEL` | info | structlog level |
| `OPENAI_API_KEY` | — | Required when provider is `openai` |
| `OPENAI_MODEL` | gpt-4o-mini | Chat model |
| `OPENAI_TIMEOUT_MS` | 30000 | Request timeout |
| `OPENAI_MAX_RETRIES` | 2 | Gateway retries |
| `REDIS_URL` | redis://redis:6379/0 | Celery broker + result backend |
| `RECOMMENDATION_PROVIDER` | mock | `mock` \| `openai` |
| `ARCHITECTURE_DECISION_GENERATOR_PROVIDER` | template | `template` \| `openai` |
| `SKIP_DB_MIGRATIONS` | 0 | Set `1` on `worker-python` |

Compose may override `DATABASE_URL` / `REDIS_URL` from the monorepo root `.env`.

---

## Commands

| Command | Purpose |
|---------|---------|
| `uvicorn arch_decisions.main:app --reload` | API (Compose default) |
| `celery -A arch_decisions.worker.celery_app worker` | Job worker |
| `pytest` | Unit + HTTP API tests |
| `ruff check .` | Lint |
| `python scripts/verify_provider_matrix.py` | Provider matrix smoke |
| `alembic upgrade head` | Apply migrations |
