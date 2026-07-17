# Architecture

## System overview

```text
Browser
  → React (gateways)
  → Express API
  → Redis / BullMQ (evaluate + generate jobs)
  → Worker
  → Providers (mock | OpenAI) + SQLite | memory
```

Evaluate and generate return **202 + jobId**; the client polls `GET /api/jobs/:jobId` until completed.

---

## Key decisions

| Area | Choice | Why |
|------|--------|-----|
| Runtime | Node 24 Active LTS | Supported LTS without chasing Current |
| API | Express 5 | Thin HTTP layer; service patterns stay visible |
| Persistence | SQLite + Knex | File DB, migrations, no extra server for a portfolio |
| Async work | BullMQ + Redis | API stays responsive; OpenAI runs off-request |
| Frontend | React 19, feature folders | Flow-based structure scales past one screen |
| State | TanStack Query + local/session | No Redux for three small flows |
| AI | Optional, explicit env | Template/mock defaults; OpenAI is opt-in |

---

## Provider configuration

Implementations are selected by **environment variables**. Invalid values throw. If config requests OpenAI without `OPENAI_API_KEY`, the app **throws** — it does not fall back to mock/template.

| Layer | Variable | Values | Default |
|-------|----------|--------|---------|
| Frontend I/O | `VITE_DATA_SOURCE` | `http` \| `local` | `http` |
| Recommendations | `RECOMMENDATION_PROVIDER` | `mock` \| `openai` | `mock` |
| ADR generator | `ARCHITECTURE_DECISION_GENERATOR_PROVIDER` | `template` \| `openai` | `template` |
| Storage | `STORAGE_PROVIDER` | `sqlite` \| `memory` | `sqlite` |

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

Verify: `npm run verify:providers` (see [getting-started.md](./getting-started.md)).

**Code map:** [dataSource.ts](../frontend/src/shared/config/dataSource.ts) · [recommendation-provider.config.ts](../backend/src/config/recommendation-provider.config.ts) · [recommendation-provider.factory.ts](../backend/src/integrations/openai/recommendation-provider.factory.ts) · [architecture-decision-provider.factory.ts](../backend/src/integrations/openai/architecture-decision-provider.factory.ts) · [architecture-decision-repository.factory.ts](../backend/src/integrations/storage/architecture-decision-repository.factory.ts)

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
├── backend/src/
│   ├── routes/        # HTTP wiring
│   ├── controllers/   # Request/response adapters
│   ├── services/      # Business use cases
│   ├── integrations/  # OpenAI, SQLite, queue
│   ├── jobs/          # BullMQ worker + processors
│   └── domain/        # Types and pure calculators
└── docs/              # This documentation set
```

**Backend flow:** `routes` → `controllers` → `services` → `integrations`  
**Frontend flow:** `pages` → feature hooks → gateways → API or local adapters

---

## Production-oriented details

- **API hardening:** Helmet, JSON body limit, rate limit on `/api`, correlation ID (`x-request-id`), central error handler  
- **SQLite:** WAL + `busy_timeout` when API and worker share the DB file  
- **Worker:** `npm run worker:dev` (watch) / `worker:prod` (built); migrations run on API only (`SKIP_DB_MIGRATIONS=1` on worker)

Full env list: [reference.md](./reference.md).
