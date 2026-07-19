# Architecture — Express backend

## Overview

```text
Client (UI or curl)
  → Express API (:3001)
  → Redis (BullMQ)
  → Worker process
  → Providers (mock | OpenAI) + SQLite | memory
```

Evaluate and generate return **202 + jobId**; clients poll `GET /api/jobs/:jobId` until completed.

---

## Key decisions

| Area | Choice | Why |
|------|--------|-----|
| Runtime | Node 24 + TypeScript | Portfolio senior Node stack |
| API | Express 5 | Thin HTTP; familiar Node ecosystem |
| Persistence | SQLite + Knex (or memory) | Simple file DB; swap via env |
| Async work | BullMQ + Redis | LLM / generation off the request |
| DI | Awilix composition root | Explicit wiring |
| Validation / OpenAPI | Zod + zod-to-openapi | One schema story for runtime + Swagger |
| AI | Optional, explicit env | Template/mock defaults; OpenAI opt-in |

---

## Provider configuration

Invalid values **throw**. OpenAI without `OPENAI_API_KEY` **throws** — no silent fallback to mock/template.

| Layer | Variable | Values | Default |
|-------|----------|--------|---------|
| Recommendations | `RECOMMENDATION_PROVIDER` | `mock` \| `openai` | `mock` |
| ADR generator | `ARCHITECTURE_DECISION_GENERATOR_PROVIDER` | `template` \| `openai` | `template` |
| Storage | `STORAGE_PROVIDER` | `sqlite` \| `memory` | `sqlite` |

### Supported combinations (API)

| ID | Rec | ADR | Storage | Notes |
|----|-----|-----|---------|-------|
| B | mock | template | sqlite | Default demo path |
| C | mock | template | memory | Stateless API |
| D–F | openai mixes | openai mixes | sqlite | Needs `OPENAI_API_KEY` |
| G–H | openai without key | — | — | Must throw at startup |

Verify: `npm run verify:providers` — see [getting-started.md](./getting-started.md).

**Code map:** [recommendation-provider.config.ts](../src/config/recommendation-provider.config.ts) · [recommendation-provider.factory.ts](../src/integrations/openai/recommendation-provider.factory.ts) · [architecture-decision-provider.factory.ts](../src/integrations/openai/architecture-decision-provider.factory.ts) · [architecture-decision-repository.factory.ts](../src/integrations/storage/architecture-decision-repository.factory.ts)

---

## Package layout

```text
backend/src/
├── app/             # composition root (Awilix DI wiring)
├── routes/          # endpoints definition + OpenAPI documentation
├── controllers/     # controller definitions that delegate business logic to services
├── services/        # application business logic
├── integrations/    # external resource adapters (AI, database, queue)
├── jobs/            # background workers and processes
├── domain/          # pure business types and rules
├── config/          # environment settings by concern
├── openapi/         # shared OpenAPI / Zod schema pieces
├── validators/      # HTTP request validation schemas
├── middleware/      # correlation ID per request and other middleware
├── lib/             # shared helpers (HTTP, errors, logging)
├── migrations/      # Knex database schema migrations
└── test/            # integration test helpers and fixtures
```

**Flow:** `routes` → `controllers` → `services` → `integrations`

---

## Production-oriented details

- Helmet, JSON body limit, rate limit on `/api`, correlation ID (`x-request-id`), central error handler  
- SQLite WAL + `busy_timeout` when API and worker share the DB file  
- Worker sets `SKIP_DB_MIGRATIONS=1`; API owns Knex migrations  

Env list: [reference.md](./reference.md).
