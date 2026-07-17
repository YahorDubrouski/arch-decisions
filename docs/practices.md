# Practices showcase

Evidence catalog: **what was implemented**, **why it matters**, and **where to look in code**.

Use this after the [5-minute review path](./for-reviewers.md). Click a path to open the file or folder on GitHub.

---

## Must-have checklists (with proof)

Course-style rules we treat as non-negotiable. Each item links to code that proves it.

### React must-haves

| # | Rule | Proof |
|---|------|-------|
| 1 | **Screen state order:** loading → error → empty → success (never flash success first) | [ArchitectureDecisionsPage.tsx](../frontend/src/pages/ArchitectureDecisionsPage.tsx) |
| 2 | **Skeleton (or explicit loading UI)** while server data loads | [DocumentsGridSkeleton.tsx](../frontend/src/features/architecture-decisions/components/DocumentsGridSkeleton.tsx) · used in list page above |
| 3 | **ErrorState with retry** for expected API failures (not toast-only) | [ErrorState.tsx](../frontend/src/shared/ui/ErrorState.tsx) · [ArchitectureDecisionPage.tsx](../frontend/src/pages/ArchitectureDecisionPage.tsx) |
| 4 | **EmptyState** with a next action (CTA / clear filters) | [EmptyState.tsx](../frontend/src/shared/ui/EmptyState.tsx) · list page empty branch |
| 5 | **Server GETs via Query** — not ad-hoc `useEffect` + `fetch` in pages | [useArchitectureDecisionsQuery.ts](../frontend/src/features/architecture-decisions/hooks/useArchitectureDecisionsQuery.ts) |
| 6 | **Every API param in `queryKey`** | Same query hook (filters in key) |
| 7 | **Mutations:** disable while pending, map errors, navigate/invalidate on success | [useEvaluateRecommendationsMutation.ts](../frontend/src/features/context/hooks/useEvaluateRecommendationsMutation.ts) · [useGenerateArchitectureDecisionMutation.ts](../frontend/src/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation.ts) |
| 8 | **No raw `fetch` in UI** — gateway / `httpClient` only | [httpClient.ts](../frontend/src/shared/api/httpClient.ts) · [HttpArchitectureDecisionGateway.ts](../frontend/src/features/architecture-decisions/gateways/HttpArchitectureDecisionGateway.ts) |
| 9 | **Correct state ownership** — form / server / URL / session / derived | [useContextForm.ts](../frontend/src/features/context/hooks/useContextForm.ts) · [useArchitectureDecisionListFilters.ts](../frontend/src/features/architecture-decisions/hooks/useArchitectureDecisionListFilters.ts) · [contextStorage.ts](../frontend/src/features/context/services/contextStorage.ts) |
| 10 | **Derived values in render** — no `useEffect` to sync derived state | [listFilters.ts](../frontend/src/features/architecture-decisions/domain/listFilters.ts) (`paginateItems`) |
| 11 | **Thin pages; presentational lists take props** | [ArchitectureDecisionsPage.tsx](../frontend/src/pages/ArchitectureDecisionsPage.tsx) → [ArchitectureDecisionGrid.tsx](../frontend/src/features/architecture-decisions/components/ArchitectureDecisionGrid.tsx) |
| 12 | **Feature folders + shared UI only for generic blocks** | [features/](../frontend/src/features/) · [shared/ui/](../frontend/src/shared/ui/) |
| 13 | **Zod (or equivalent) at boundaries** — forms / API / storage reads | [contextSchema.ts](../frontend/src/domain/contextSchema.ts) · storage services |
| 14 | **Accessible forms** — labels, invalid/described-by where errors show | [Step1TeamSize.tsx](../frontend/src/features/context/components/Step1TeamSize.tsx) |
| 15 | **Tests assert behavior** (roles / user events), not internal state | [ArchitectureDecisionsPage.test.tsx](../frontend/src/pages/__tests__/ArchitectureDecisionsPage.test.tsx) |
| 16 | **Lazy route code ≠ data loading** — Suspense for JS; Query for data | [routes.tsx](../frontend/src/app/routes.tsx) · [PageFallback.tsx](../frontend/src/app/PageFallback.tsx) |

Canonical coding rules for this stack: [`.cursor/rules/react-portfolio-rules.mdc`](../.cursor/rules/react-portfolio-rules.mdc).

### Backend must-haves

| # | Rule | Proof |
|---|------|-------|
| 1 | **Thin HTTP layer** — controllers parse/validate, call services, return status | [recommendations.controller.ts](../backend/src/controllers/recommendations.controller.ts) |
| 2 | **Business logic in services** — no Express types in domain/services core | [services/](../backend/src/services/) |
| 3 | **Integrations behind factories** — swappable providers | [recommendation-provider.factory.ts](../backend/src/integrations/openai/recommendation-provider.factory.ts) |
| 4 | **Explicit provider config; fail loud** — never silent mock when openai selected | [recommendation-provider.config.ts](../backend/src/config/recommendation-provider.config.ts) · factory above |
| 5 | **Zod (or schema) validation at HTTP boundary** before enqueue/work | [evaluate-recommendations-request.schema.ts](../backend/src/validators/http/evaluate-recommendations-request.schema.ts) |
| 6 | **Central errors** — typed `AppError` + one error middleware | [app-error.ts](../backend/src/lib/errors/app-error.ts) · [error-handler.middleware.ts](../backend/src/middleware/error-handler.middleware.ts) |
| 7 | **Async route errors always reach the handler** (ApiRouter / asyncHandler) | [api-router.ts](../backend/src/lib/http/api-router.ts) |
| 8 | **Correlation ID** on request, response, logs, error JSON | [correlation-id.middleware.ts](../backend/src/middleware/correlation-id.middleware.ts) |
| 9 | **Hardening baseline** — Helmet, body size limit, rate limit | [app.ts](../backend/src/app.ts) · [rate-limit.middleware.ts](../backend/src/middleware/rate-limit.middleware.ts) |
| 10 | **Long work off-request** — queue + worker; 202 + job status | [architecture-jobs.queue.ts](../backend/src/integrations/queue/architecture-jobs.queue.ts) · [worker.ts](../backend/src/worker.ts) · [jobs.controller.ts](../backend/src/controllers/jobs.controller.ts) |
| 11 | **Upstream retries with backoff** for flaky vendors | [openai-gateway.ts](../backend/src/integrations/openai/openai-gateway.ts) |
| 12 | **Migrations for schema** — not ad-hoc DDL in app boot | [migrations/](../backend/src/migrations/) |
| 13 | **Composition root / DI** for wiring | [create-app-container.ts](../backend/src/app/create-app-container.ts) |
| 14 | **Tests: Arrange / Act / Assert** (+ Given/When/Then when non-trivial) | [recommendation-provider.factory.test.ts](../backend/src/integrations/openai/__tests__/recommendation-provider.factory.test.ts) · [tests.mdc](../.cursor/rules/tests.mdc) |
| 15 | **HTTP API integration tests** (Supertest) | [api.integration.test.ts](../backend/src/__tests__/api.integration.test.ts) |
| 16 | **OpenAPI / Swagger UI** | [schemas.ts](../backend/src/openapi/schemas.ts) · [register-paths.ts](../backend/src/openapi/register-paths.ts) · [swagger.routes.ts](../backend/src/routes/swagger.routes.ts) · [screenshot](./screenshots/07-swagger-express.png) |

---

## Backend Python (senior FastAPI)

Same product contract as Express (`202` + job polling). Proof links below.

| # | Rule | Proof |
|---|------|-------|
| 1 | **Thin HTTP layer** | [recommendations.py](../backend-python/src/arch_decisions/api/routes/recommendations.py) |
| 2 | **Services hold use cases** | [services/](../backend-python/src/arch_decisions/services/) |
| 3 | **Factories + fail loud** | [recommendation_provider_factory.py](../backend-python/src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py) |
| 4 | **Pydantic at boundaries** | [context.py](../backend-python/src/arch_decisions/domain/context.py) · route validation |
| 5 | **Composition root + Depends** | [container.py](../backend-python/src/arch_decisions/container.py) · [deps.py](../backend-python/src/arch_decisions/api/deps.py) |
| 6 | **Celery worker split** | [tasks.py](../backend-python/src/arch_decisions/workers/tasks.py) · [worker.py](../backend-python/src/arch_decisions/worker.py) |
| 7 | **PostgreSQL + Alembic** | [models.py](../backend-python/src/arch_decisions/infrastructure/db/models.py) · [alembic/versions/](../backend-python/alembic/versions/) |
| 8 | **OpenAI retries** | [openai_gateway.py](../backend-python/src/arch_decisions/infrastructure/openai/openai_gateway.py) |
| 9 | **Correlation ID + errors** | [correlation_id.py](../backend-python/src/arch_decisions/api/middleware/correlation_id.py) · [errors.py](../backend-python/src/arch_decisions/core/errors.py) |
| 10 | **Provider matrix smoke** | [verify_provider_matrix.py](../backend-python/scripts/verify_provider_matrix.py) |
| 11 | **pytest suite** | [tests/unit/](../backend-python/tests/unit/) |
| 12 | **HTTP API integration tests** (TestClient) | [test_api_integration.py](../backend-python/tests/api/test_api_integration.py) |
| 13 | **OpenAPI / Swagger UI** | [api/schemas](../backend-python/src/arch_decisions/api/schemas/__init__.py) · FastAPI `/docs` · [screenshot](./screenshots/08-swagger-python.png) |

---

## Frontend (senior React)

### Architecture and boundaries

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Feature-based folders | One user flow per folder (components, hooks, gateways, domain) — not a flat `components/` dump | [context/](../frontend/src/features/context/) · [recommendations/](../frontend/src/features/recommendations/) · [architecture-decisions/](../frontend/src/features/architecture-decisions/) |
| Thin pages | Pages compose hooks + feature UI; lists receive props | [ArchitectureDecisionsPage.tsx](../frontend/src/pages/ArchitectureDecisionsPage.tsx) → [ArchitectureDecisionGrid.tsx](../frontend/src/features/architecture-decisions/components/ArchitectureDecisionGrid.tsx) |
| Domain without React | Zod schemas and pure calculators — testable without rendering | [contextSchema.ts](../frontend/src/domain/contextSchema.ts) · [calculateTradeOffs.ts](../frontend/src/domain/calculateTradeOffs.ts) |
| Dependency direction | Pages/features → shared/domain; shared never imports features | [shared/](../frontend/src/shared/) · [frontend.md](./frontend.md) |

### State ownership (which storage when)

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Form = local `useState` | Wizard step and fields live with the form owner | [useContextForm.ts](../frontend/src/features/context/hooks/useContextForm.ts) |
| Server state = TanStack Query | Lists/detail from API with loading/error/cache keys | [useArchitectureDecisionsQuery.ts](../frontend/src/features/architecture-decisions/hooks/useArchitectureDecisionsQuery.ts) |
| Session = `sessionStorage` + Zod | Cross-route workflow data, validated on read | [contextStorage.ts](../frontend/src/features/context/services/contextStorage.ts) · [recommendationsStorage.ts](../frontend/src/features/recommendations/services/recommendationsStorage.ts) |
| URL state for lists | Search/status/page/pageSize shareable and refresh-safe | [useArchitectureDecisionListFilters.ts](../frontend/src/features/architecture-decisions/hooks/useArchitectureDecisionListFilters.ts) |
| Derived during render | Pagination math / “filters empty” — no syncing into state | [listFilters.ts](../frontend/src/features/architecture-decisions/domain/listFilters.ts) |

### Strategy / ports (data source)

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Gateway port + adapters | UI depends on a stable interface; HTTP vs local is a factory choice | [architectureDecisionGateway.port.ts](../frontend/src/features/architecture-decisions/gateways/architectureDecisionGateway.port.ts) |
| Explicit `VITE_DATA_SOURCE` | `http` \| `local` — no silent switch | [dataSource.ts](../frontend/src/shared/config/dataSource.ts) · [createArchitectureDecisionGateway.ts](../frontend/src/features/architecture-decisions/gateways/createArchitectureDecisionGateway.ts) |
| Local parity | Same contracts offline (rules + template ADR + session) | [evaluateRecommendationsLocally.ts](../frontend/src/features/recommendations/domain/evaluateRecommendationsLocally.ts) · [LocalRecommendationsGateway.ts](../frontend/src/features/recommendations/gateways/LocalRecommendationsGateway.ts) |

### Async, HTTP, and UX

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Mutations: pending / error / navigate | Evaluate and generate with abort + user-facing errors | [useEvaluateRecommendationsMutation.ts](../frontend/src/features/context/hooks/useEvaluateRecommendationsMutation.ts) · [useGenerateArchitectureDecisionMutation.ts](../frontend/src/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation.ts) |
| Job polling | Enqueue → poll → Zod-parse result (202 jobs) | [enqueueAndWaitForJobResult.ts](../frontend/src/shared/api/enqueueAndWaitForJobResult.ts) |
| Shared HTTP client | Typed errors, abort detection, “failed to fetch” mapping | [httpClient.ts](../frontend/src/shared/api/httpClient.ts) |
| Explicit UI states | Loading / error / empty / success on list pages | [ArchitectureDecisionsPage.tsx](../frontend/src/pages/ArchitectureDecisionsPage.tsx) |
| Lazy routes + Suspense | Route-level code split (JS load ≠ data load) | [routes.tsx](../frontend/src/app/routes.tsx) · [PageFallback.tsx](../frontend/src/app/PageFallback.tsx) |

### UI system and quality

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| CSS Modules + tokens | Scoped styles; design tokens in one place | [tokens.css](../frontend/src/shared/styles/tokens.css) · co-located `*.module.css` |
| Accessibility basics | Labels, `aria-invalid` / described-by, alerts | [Step1TeamSize.tsx](../frontend/src/features/context/components/Step1TeamSize.tsx) · [RecommendationCard.tsx](../frontend/src/features/recommendations/components/RecommendationCard.tsx) |
| Testing Library | Behavior tests (`getByRole`, user-event), co-located `__tests__` | [ContextBuilderPage.test.tsx](../frontend/src/pages/__tests__/ContextBuilderPage.test.tsx) · [ArchitectureDecisionsPage.test.tsx](../frontend/src/pages/__tests__/ArchitectureDecisionsPage.test.tsx) |
| AAA + Given/When/Then | Test comments/docblocks as living docs | [tests.mdc](../.cursor/rules/tests.mdc) |

---

## Backend (senior Node / API)

### Layering and composition

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Controllers → services → integrations | HTTP adapters stay thin; business logic in services | [recommendations.controller.ts](../backend/src/controllers/recommendations.controller.ts) · [services/](../backend/src/services/) · [integrations/](../backend/src/integrations/) |
| DI (Awilix) | Single composition root for controllers, services, factories | [create-app-container.ts](../backend/src/app/create-app-container.ts) |
| Domain purity | Types and trade-off rules without Express | [domain/](../backend/src/domain/) · [trade-off-calculator.ts](../backend/src/domain/trade-off-calculator.ts) |

### Strategy pattern (providers) — fail loud

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Explicit recommendation provider | `mock` \| `openai` from env; openai without key **throws** | [recommendation-provider.config.ts](../backend/src/config/recommendation-provider.config.ts) · [recommendation-provider.factory.ts](../backend/src/integrations/openai/recommendation-provider.factory.ts) |
| Explicit ADR generator | `template` \| `openai` — same fail-loud rule | [architecture-decision-provider.factory.ts](../backend/src/integrations/openai/architecture-decision-provider.factory.ts) |
| Explicit storage | `sqlite` \| `memory` | [architecture-decision-repository.factory.ts](../backend/src/integrations/storage/architecture-decision-repository.factory.ts) |
| Matrix smoke | Script proves combos B–H including live OpenAI | [verify-provider-matrix.ts](../backend/scripts/verify-provider-matrix.ts) (`npm run verify:providers`) |

### Async jobs (queue)

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| BullMQ + Redis | Heavy work off the request thread | [architecture-jobs.queue.ts](../backend/src/integrations/queue/architecture-jobs.queue.ts) |
| Dedicated worker process | API ≠ worker; graceful SIGTERM/SIGINT | [worker.ts](../backend/src/worker.ts) · [start-architecture-jobs-worker.ts](../backend/src/jobs/start-architecture-jobs-worker.ts) |
| 202 + poll | Controllers enqueue; status via jobs API | [jobs.controller.ts](../backend/src/controllers/jobs.controller.ts) · [get-architecture-job.service.ts](../backend/src/services/jobs/get-architecture-job.service.ts) |
| Typed processors | Evaluate vs generate job handlers | [processors/](../backend/src/jobs/processors/) |

### HTTP hardening and reliability

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| ApiRouter | Every API route auto-forwards sync/async errors | [api-router.ts](../backend/src/lib/http/api-router.ts) · [async-handler.ts](../backend/src/lib/http/async-handler.ts) |
| Correlation ID | `x-request-id` on request/response/logs/errors | [correlation-id.middleware.ts](../backend/src/middleware/correlation-id.middleware.ts) |
| Helmet + rate limit + body cap | Baseline security headers; 120/min; 100kb JSON | [app.ts](../backend/src/app.ts) · [rate-limit.middleware.ts](../backend/src/middleware/rate-limit.middleware.ts) |
| Central error handler | `AppError` hierarchy → consistent JSON | [error-handler.middleware.ts](../backend/src/middleware/error-handler.middleware.ts) · [app-error.ts](../backend/src/lib/errors/app-error.ts) |
| Zod at HTTP boundary | Validate before enqueue | [evaluate-recommendations-request.schema.ts](../backend/src/validators/http/evaluate-recommendations-request.schema.ts) |

### Integrations and data

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| OpenAI gateway | Timeouts + exponential backoff retries | [openai-gateway.ts](../backend/src/integrations/openai/openai-gateway.ts) |
| Knex migrations | Versioned schema (not ad-hoc CREATE TABLE) | [migrations/](../backend/src/migrations/) · [run-sqlite-migrations.ts](../backend/src/integrations/storage/run-sqlite-migrations.ts) |
| SQLite WAL + busy_timeout | Shared file between API and worker | [knex.client.ts](../backend/src/integrations/storage/knex.client.ts) |
| Seed without wipe | Insert missing seed IDs only | [seed-architecture-decisions-if-empty.ts](../backend/src/integrations/storage/seed/seed-architecture-decisions-if-empty.ts) |

---

## DevOps and delivery

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Multi-service Compose | Frontend, API, worker, Redis | [docker-compose.yml](../docker-compose.yml) · [docker-compose.dev.yml](../docker-compose.dev.yml) |
| Worker scripts named by env | `worker:dev` (watch) vs `worker:prod` (built) | [backend/package.json](../backend/package.json) |
| Migrations owned by API | Worker sets `SKIP_DB_MIGRATIONS=1` | [docker-entrypoint.sh](../backend/docker-entrypoint.sh) · Compose worker env |
| Docker-first tooling | npm/test/lint via `docker-compose exec` | [docker-workflow.mdc](../.cursor/rules/docker-workflow.mdc) · [Makefile](../Makefile) |
| One-command up/down | `make docker-up` / `make docker-down` | [Makefile](../Makefile) |

---

## Cross-cutting (architecture signals)

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Explicit trade-offs in product UX | Cost / complexity / risk / ops on every recommendation | [RecommendationCard.tsx](../frontend/src/features/recommendations/components/RecommendationCard.tsx) · [trade-off-calculator.ts](../backend/src/domain/trade-off-calculator.ts) |
| ADR as first-class artifact | Generate, list, view summary/full, copy, download | [ArchitectureDecisionPage.tsx](../frontend/src/pages/ArchitectureDecisionPage.tsx) · [exportArchitectureDecision.ts](../frontend/src/features/architecture-decisions/utils/exportArchitectureDecision.ts) |
| Documented provider matrix | Ops and reviewers see intended mode | [architecture.md — providers](./architecture.md#provider-configuration) |
| Codified engineering rules | Naming, comments, React state, Docker | [.cursor/rules/](../.cursor/rules/) |

---

## Suggested deep-dive order

1. **Frontend state** — [useContextForm.ts](../frontend/src/features/context/hooks/useContextForm.ts) → [useArchitectureDecisionsQuery.ts](../frontend/src/features/architecture-decisions/hooks/useArchitectureDecisionsQuery.ts) → [useArchitectureDecisionListFilters.ts](../frontend/src/features/architecture-decisions/hooks/useArchitectureDecisionListFilters.ts)
2. **Gateway strategy** — [dataSource.ts](../frontend/src/shared/config/dataSource.ts) → [createArchitectureDecisionGateway.ts](../frontend/src/features/architecture-decisions/gateways/createArchitectureDecisionGateway.ts) → Http vs Local under [gateways/](../frontend/src/features/architecture-decisions/gateways/)
3. **Backend providers** — [recommendation-provider.factory.ts](../backend/src/integrations/openai/recommendation-provider.factory.ts) → [recommendation-provider.factory.test.ts](../backend/src/integrations/openai/__tests__/recommendation-provider.factory.test.ts)
4. **Queue** — [enqueue-architecture-job.service.ts](../backend/src/services/jobs/enqueue-architecture-job.service.ts) → [worker.ts](../backend/src/worker.ts) → [enqueueAndWaitForJobResult.ts](../frontend/src/shared/api/enqueueAndWaitForJobResult.ts)
5. **HTTP pipeline** — [app.ts](../backend/src/app.ts) → [api-router.ts](../backend/src/lib/http/api-router.ts) → [correlation-id.middleware.ts](../backend/src/middleware/correlation-id.middleware.ts) · [error-handler.middleware.ts](../backend/src/middleware/error-handler.middleware.ts)

Companion narrative: [frontend.md](./frontend.md) · [architecture.md](./architecture.md) · [for-reviewers.md](./for-reviewers.md)
