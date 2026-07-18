# Getting started — Python backend

## Docker (recommended)

From the **monorepo root** (Compose starts API + Celery worker + Redis + Postgres):

```bash
make docker-up
```

| Service | URL |
|---------|-----|
| Python API | http://localhost:3002 |
| Health | http://localhost:3002/health |
| Swagger UI | http://localhost:3002/docs |
| OpenAPI JSON | http://localhost:3002/openapi.json |

```bash
make docker-down
```

Env templates:

- monorepo root `.env.example` → `.env` (`REDIS_URL`, `POSTGRES_*`, …)
- `backend-python/.env.example` → `backend-python/.env`

Point the companion UI at this API: `VITE_API_URL=http://localhost:3002`.

---

## Tests and verify

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python pytest
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python ruff check .
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python python scripts/verify_provider_matrix.py
```

Provider matrix: [architecture.md](./architecture.md#provider-configuration).

---

## Migrations (PostgreSQL)

Alembic runs on API container start (`alembic upgrade head`). Worker sets `SKIP_DB_MIGRATIONS=1`.

Manual:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python alembic upgrade head
```

Use `STORAGE_PROVIDER=memory` for in-process storage (no Postgres).

---

## Smoke the async contract

```bash
curl -s -X POST http://localhost:3002/api/recommendations/evaluate \
  -H 'content-type: application/json' \
  -d '{"context":{"teamSize":"1-5","trafficPattern":"low-steady","budgetSensitivity":"cost-optimized","complianceRequirements":[],"operationalMaturity":"minimal"}}'

# Poll: GET http://localhost:3002/api/jobs/{jobId}
```

Companion UI: http://localhost:5174 with `VITE_API_URL=http://localhost:3002`.
