# Getting started — Express backend

## Docker (recommended)

From the **monorepo root** (Compose starts API + BullMQ worker + Redis):

```bash
make docker-up
```

| Service | URL |
|---------|-----|
| Express API | http://localhost:3001 |
| Health | http://localhost:3001/health |
| Swagger UI | http://localhost:3001/api-docs |
| OpenAPI JSON | http://localhost:3001/openapi.json |

```bash
make docker-down
```

Env templates:

- monorepo root `.env.example` → `.env` (`REDIS_URL`, …)
- `backend/.env.example` → `backend/.env`

---

## Manual run (without Docker)

Needs Redis (`REDIS_URL`).

```bash
cd backend && npm install && npm run dev
```

Worker (second terminal):

```bash
cd backend && npm run worker:dev
```

---

## Tests and verify

From monorepo root, inside the running container:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run test
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run lint
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run verify:providers
```

Provider matrix: [architecture.md](./architecture.md#provider-configuration).

---

## Migrations (SQLite)

Applied automatically on API container start. Manual:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run migrate
```

Use `STORAGE_PROVIDER=memory` for a stateless API (no DB file).

---

## Smoke the async contract

```bash
# Evaluate → 202 + jobId
curl -s -X POST http://localhost:3001/api/recommendations/evaluate \
  -H 'content-type: application/json' \
  -d '{"context":{"teamSize":"1-5","trafficPattern":"low-steady","budgetSensitivity":"cost-optimized","complianceRequirements":[],"operationalMaturity":"minimal"}}'

# Poll: GET http://localhost:3001/api/jobs/{jobId}
```

Full product UI (optional companion): http://localhost:5174 with `VITE_API_URL=http://localhost:3001`.
