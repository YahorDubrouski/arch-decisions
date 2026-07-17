# Reference

## API

Base URL (local Docker): `http://localhost:3001`

### Health

`GET /health` → `{ "status": "ok", "message": "..." }`

### Recommendations

`POST /api/recommendations/evaluate`

Body: `{ "context": ProjectContext }` (or raw context object).

Response: **202** `{ "jobId": "..." }` — poll job status, then read `result` when `status` is `completed`.

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

Sample files: [examples/scenarios/](./examples/scenarios/)

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Purpose |
|----------|---------|---------|
| `NODE_ENV` | development | Runtime mode |
| `PORT` | 3000 | API port inside container |
| `DATABASE_PATH` | `./data/decisions.db` | SQLite file path |
| `STORAGE_PROVIDER` | sqlite | `sqlite` \| `memory` |
| `LOG_LEVEL` | info | Winston level |
| `OPENAI_API_KEY` | — | Required when provider is `openai` |
| `OPENAI_MODEL` | gpt-4o-mini | Chat model |
| `OPENAI_TIMEOUT_MS` | 30000 | Request timeout |
| `OPENAI_MAX_RETRIES` | 2 | SDK + gateway retries |
| `REDIS_URL` | redis://localhost:6379 | BullMQ broker |
| `RECOMMENDATION_PROVIDER` | mock | `mock` \| `openai` |
| `ARCHITECTURE_DECISION_GENERATOR_PROVIDER` | template | `template` \| `openai` |
| `SKIP_DB_MIGRATIONS` | 0 | Set `1` on worker container |

### Frontend

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | — | API origin when `VITE_DATA_SOURCE=http` |
| `VITE_DATA_SOURCE` | http | `http` \| `local` |

---

## Scripts (backend)

| Script | Purpose |
|--------|---------|
| `npm run dev` | API with tsx watch |
| `npm run worker:dev` | Job worker with watch |
| `npm run worker:prod` | Built worker |
| `npm run verify:providers` | Provider matrix smoke |
| `npm run migrate` | Apply Knex migrations |
