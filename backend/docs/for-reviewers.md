# For reviewers — Express backend

Short path to evaluate this **Node / Express** package without reading the whole monorepo.

---

## 5-minute path

1. **Read** [../README.md](../README.md) (overview + screenshots)  
2. **Run** `make docker-up` from monorepo root → open http://localhost:3001/api-docs  
3. **Skim** [architecture.md](./architecture.md) (providers + layout)  
4. **Open** [practices.md](./practices.md) — must-haves with proof links  
5. **Deep-dive code:**
   - [create-app-container.ts](../src/app/create-app-container.ts)  
   - [start-architecture-jobs-worker.ts](../src/jobs/start-architecture-jobs-worker.ts)  
   - [recommendation-provider.factory.ts](../src/integrations/openai/recommendation-provider.factory.ts) (fail loud)

Optional companion UI: http://localhost:5174 → Context → Recommendations → Generate ADR (pointed at `:3001`).

---

## What this demonstrates

| Theme | Evidence |
|-------|----------|
| Layered API | controllers → services → integrations |
| Explicit configuration | Provider matrix; no silent OpenAI→mock fallback |
| Async jobs | BullMQ worker; 202 + job polling |
| OpenAPI / Swagger | Zod schemas + sibling `*.openapi.ts`; `/api-docs` |
| Hardening | Helmet, rate limit, correlation ID, central errors |
| Tests | Jest unit + Supertest HTTP integration (~47 tests) |

Full checklist: [practices.md](./practices.md).

---

## Competency map (backend)

| # | Competency | Where |
|---|------------|-------|
| 1 | Layered architecture | [services/](../src/services/) · [integrations/](../src/integrations/) |
| 2 | DI / composition root | [create-app-container.ts](../src/app/create-app-container.ts) |
| 3 | Strategy / providers | Factories under [integrations/openai/](../src/integrations/openai/) |
| 4 | Queue design | [jobs/](../src/jobs/) · BullMQ |
| 5 | API contract + docs | [openapi/](../src/openapi/) · Swagger |
| 6 | Reliability | [openai-gateway.ts](../src/integrations/openai/openai-gateway.ts) retries |
| 7 | Observability basics | Winston + correlation ID |
| 8 | Schema migrations | [migrations/](../src/migrations/) |
