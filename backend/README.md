# Architecture Decisions — Express backend

Node/Express implementation of the Architecture Decisions API: recommendations + ADR generation via `202` + job polling, provider matrix, BullMQ worker, SQLite (or in-memory) persistence.

Point the frontend here with `VITE_API_URL=http://localhost:3001` (Compose default).

---

## Quick start (Docker)

From the **repo root**:

```bash
make docker-up
```

| Service | URL |
|---------|-----|
| Express API | http://localhost:3001 |
| Health | http://localhost:3001/health |
| Swagger UI | http://localhost:3001/api-docs |
| OpenAPI JSON | http://localhost:3001/openapi.json |

Python twin is on http://localhost:3002 — see [../backend-python/README.md](../backend-python/README.md).

Copy env if needed: `.env.example` → `.env` (Compose may override `REDIS_URL` from the root `.env`).

---

## Commands (inside the container)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run test
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run lint
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run verify:providers
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run migrate
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | API with tsx watch |
| `npm run worker:dev` | BullMQ worker with watch |
| `npm run test` | Jest unit + HTTP integration tests |
| `npm run verify:providers` | Provider smoke (mock/template/openai) |
| `npm run migrate` | Knex migrations (also on API boot) |

---

## Layout

```text
src/
├── routes/          # HTTP routes + sibling *.openapi.ts docs
├── controllers/     # thin HTTP adapters
├── services/        # use cases
├── integrations/    # openai, storage, queue adapters
├── jobs/            # BullMQ worker entry
├── domain/          # pure business types
├── config/          # env by concern
├── openapi/         # shared Zod schemas by domain
└── middleware/      # correlation id, errors, security, rate limit
```

Flow: `routes` → `controllers` → `services` → `integrations`.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [../docs/getting-started.md](../docs/getting-started.md) | Run, test, env setup |
| [../docs/architecture.md](../docs/architecture.md) | Providers, layout, workers |
| [../docs/reference.md](../docs/reference.md) | API + env vars + scripts |
| [../docs/practices.md](../docs/practices.md) | Senior Express checklist with file proof |
| [../README.md](../README.md) | Product overview + screenshots |

---

## Stack

Node 24 · Express 5 · TypeScript · Zod + zod-to-openapi · BullMQ + Redis · better-sqlite3 + Knex · Winston · Jest · Supertest
