# Practices — Express backend

Evidence catalog: **what was implemented**, **why it matters**, and **where to look in code**.

Use after the [5-minute review path](./for-reviewers.md).

---

## Must-have checklist (with proof)

| # | Rule | Proof |
|---|------|-------|
| 1 | **Thin HTTP layer** — controllers parse/validate, call services, return status | [recommendations.controller.ts](../src/controllers/recommendations.controller.ts) |
| 2 | **Business logic in services** — no Express types in domain/services core | [services/](../src/services/) |
| 3 | **Integrations behind factories** — swappable providers | [recommendation-provider.factory.ts](../src/integrations/openai/recommendation-provider.factory.ts) |
| 4 | **Explicit provider config; fail loud** — never silent mock when openai selected | [recommendation-provider.config.ts](../src/config/recommendation-provider.config.ts) · factory above |
| 5 | **Zod validation at HTTP boundary** before enqueue/work | [evaluate-recommendations-request.schema.ts](../src/validators/http/evaluate-recommendations-request.schema.ts) |
| 6 | **Central errors** — typed `AppError` + one error middleware | [app-error.ts](../src/lib/errors/app-error.ts) · [error-handler.middleware.ts](../src/middleware/error-handler.middleware.ts) |
| 7 | **Async route errors always reach the handler** (ApiRouter / asyncHandler) | [api-router.ts](../src/lib/http/api-router.ts) |
| 8 | **Correlation ID** on request, response, logs, error JSON | [correlation-id.middleware.ts](../src/middleware/correlation-id.middleware.ts) |
| 9 | **Hardening baseline** — Helmet, body size limit, rate limit | [app.ts](../src/app.ts) · [rate-limit.middleware.ts](../src/middleware/rate-limit.middleware.ts) |
| 10 | **Long work off-request** — queue + worker; 202 + job status | [architecture-jobs.queue.ts](../src/integrations/queue/architecture-jobs.queue.ts) · [worker.ts](../src/worker.ts) · [jobs.controller.ts](../src/controllers/jobs.controller.ts) |
| 11 | **Upstream retries with backoff** for flaky vendors | [openai-gateway.ts](../src/integrations/openai/openai-gateway.ts) |
| 12 | **Migrations for schema** — not ad-hoc DDL in app boot | [migrations/](../src/migrations/) |
| 13 | **Composition root / DI** for wiring | [create-app-container.ts](../src/app/create-app-container.ts) |
| 14 | **Tests: Arrange / Act / Assert** (+ Given/When/Then when non-trivial) | [recommendation-provider.factory.test.ts](../src/integrations/openai/__tests__/recommendation-provider.factory.test.ts) |
| 15 | **HTTP API integration tests** (Supertest) | [controllers/](../src/controllers/) `__tests__` · [health](../src/routes/health/__tests__/health.integration.test.ts) · [openapi](../src/routes/__tests__/openapi.integration.test.ts) |
| 16 | **OpenAPI / Swagger UI** | [openapi/schemas/](../src/openapi/schemas/) · [generate.openapi.ts](../src/routes/architecture-decisions/generate.openapi.ts) · [swagger.routes.ts](../src/routes/swagger.routes.ts) · [screenshot](./screenshots/07-swagger-express.png) |

---

## Layering and composition

| Practice | Where to check |
|----------|----------------|
| Controllers → services → integrations | [recommendations.controller.ts](../src/controllers/recommendations.controller.ts) · [services/](../src/services/) · [integrations/](../src/integrations/) |
| DI (Awilix) | [create-app-container.ts](../src/app/create-app-container.ts) |
| Domain purity | [domain/](../src/domain/) · [trade-off-calculator.ts](../src/domain/trade-off-calculator.ts) |

---

## Strategy pattern (providers) — fail loud

| Practice | Where to check |
|----------|----------------|
| Recommendation `mock` \| `openai` | [recommendation-provider.factory.ts](../src/integrations/openai/recommendation-provider.factory.ts) |
| ADR `template` \| `openai` | [architecture-decision-provider.factory.ts](../src/integrations/openai/architecture-decision-provider.factory.ts) |
| Storage `sqlite` \| `memory` | [architecture-decision-repository.factory.ts](../src/integrations/storage/architecture-decision-repository.factory.ts) |
| Matrix smoke | [verify-provider-matrix.ts](../scripts/verify-provider-matrix.ts) |

---

## Async jobs (BullMQ)

| Practice | Where to check |
|----------|----------------|
| Queue + Redis | [architecture-jobs.queue.ts](../src/integrations/queue/architecture-jobs.queue.ts) |
| Dedicated worker | [worker.ts](../src/worker.ts) · [start-architecture-jobs-worker.ts](../src/jobs/start-architecture-jobs-worker.ts) |
| 202 + poll | [jobs.controller.ts](../src/controllers/jobs.controller.ts) |
| Typed processors | [processors/](../src/jobs/processors/) |

---

## HTTP hardening and reliability

| Practice | Where to check |
|----------|----------------|
| ApiRouter / asyncHandler | [api-router.ts](../src/lib/http/api-router.ts) |
| Correlation ID | [correlation-id.middleware.ts](../src/middleware/correlation-id.middleware.ts) |
| Helmet + rate limit + body cap | [app.ts](../src/app.ts) · [rate-limit.middleware.ts](../src/middleware/rate-limit.middleware.ts) |
| Central error handler | [error-handler.middleware.ts](../src/middleware/error-handler.middleware.ts) |
| OpenAI gateway retries | [openai-gateway.ts](../src/integrations/openai/openai-gateway.ts) |
| Knex migrations + SQLite WAL | [migrations/](../src/migrations/) · [knex.client.ts](../src/integrations/storage/knex.client.ts) |

---

## Suggested deep-dive order

1. [create-app-container.ts](../src/app/create-app-container.ts)  
2. [recommendation-provider.factory.ts](../src/integrations/openai/recommendation-provider.factory.ts)  
3. [enqueue-architecture-job.service.ts](../src/services/jobs/enqueue-architecture-job.service.ts) → [worker.ts](../src/worker.ts)  
4. [app.ts](../src/app.ts) → [api-router.ts](../src/lib/http/api-router.ts) → correlation + error middleware  
5. Open Swagger: http://localhost:3001/api-docs  

Companion: [architecture.md](./architecture.md) · [for-reviewers.md](./for-reviewers.md)
