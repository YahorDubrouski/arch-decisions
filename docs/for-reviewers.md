# For reviewers

A short path to evaluate this portfolio without reading the whole repo.

---

## 5-minute path

1. **Read** [README.md](../README.md) (overview + screenshots)  
2. **Run** `make docker-up` → open http://localhost:5174  
3. **Walk** Context → Recommendations → Generate ADR → Documents → open ADR (summary + full)  
4. **Backend API (optional):** open Swagger — [Express](http://localhost:3001/api-docs) or [Python](http://localhost:3002/docs)  
   - Package docs: [backend/docs/](../backend/docs/) · [backend-python/docs/](../backend-python/docs/)

5. **Skim** [architecture.md](./architecture.md) (decisions + provider model)  
6. **Open** [practices.md](./practices.md) — **must-have checklists with proof links**, then the full practice map  
7. **Deep-dive code** (pick one track):
   - **Express:** [create-app-container.ts](../backend/src/app/create-app-container.ts) · [start-architecture-jobs-worker.ts](../backend/src/jobs/start-architecture-jobs-worker.ts)
   - **Python:** [container.py](../backend-python/src/arch_decisions/container.py) · [tasks.py](../backend-python/src/arch_decisions/workers/tasks.py)
   - **Frontend:** [recommendations/gateways/](../frontend/src/features/recommendations/gateways/) · [RecommendationsPage.tsx](../frontend/src/pages/RecommendationsPage.tsx)
   - **Config:** [recommendation-provider.factory.ts](../backend/src/integrations/openai/recommendation-provider.factory.ts) or [recommendation_provider_factory.py](../backend-python/src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py) (fail loud)

Optional: [full journey](./examples/flows/full-journey.md) with curl examples.

Start of [practices.md](./practices.md): React/backend **must-haves** (skeleton, loading→error→empty→success, Query keys, fail-loud factories, queue, …) each with a code link.

---

## What this demonstrates

Short themes below. **Full practice → file map:** [practices.md](./practices.md).

| Theme | Evidence |
|-------|----------|
| Architectural thinking | Layered backend; feature-based frontend; [architecture.md](./architecture.md) |
| Trade-offs | Recommendation cards show cost/complexity/risk/ops; alternatives listed |
| Explicit configuration | Provider matrix; no silent OpenAI→mock fallback |
| ADRs | Generate, persist, view, export markdown |
| React maturity | Correct state ownership; gateways; thin pages; co-located tests |
| Pragmatic DevOps | Docker compose, migrations, worker split, verify script |
| Dual backend | Express + FastAPI sharing one API contract (`:3001` / `:3002`) |
| OpenAPI / Swagger | Code-first OpenAPI; shared schemas + per-endpoint sibling docs (`*.openapi.ts` / `*_docs.py`); UI at `/api-docs` (Express) and `/docs` (Python) |

---

## Competency map

### Architecture and platform (1–10)

| # | Competency | Where |
|---|------------|-------|
| 1 | Architectural thinking | Layered BE + feature FE; provider factories |
| 2 | Decision-making under constraints | Rule-based + optional OpenAI providers |
| 3 | Explicit trade-offs | [calculateTradeOffs.ts](../frontend/src/domain/calculateTradeOffs.ts), recommendation UI |
| 4 | Business impact | Trade-off dimensions on every category |
| 5 | Ownership of decisions | Documented stack and config choices |
| 6 | Structuring requirements | 5-step context wizard |
| 7 | Clear communication | This docs set + examples |
| 8 | Pragmatic DevOps | Docker, Knex, BullMQ, `verify:providers` |
| 9 | AI as decision-support | Template/mock default; OpenAI opt-in |
| 10 | ADRs | Full document lifecycle in UI |

### Frontend (11–17)

| # | Competency | Where |
|---|------------|-------|
| 11 | React architecture | [features/](../frontend/src/features/), [pages/](../frontend/src/pages/), [domain/](../frontend/src/domain/), [shared/](../frontend/src/shared/) |
| 12 | State boundaries | Hooks, Query, session storage — see [practices.md](./practices.md) |
| 13 | Separation of concerns | Domain vs gateways vs pages |
| 14 | Async orchestration | Mutations, job polling, error states |
| 15 | Maintainability | One folder per feature; FE tests |
| 16 | Performance awareness | Query cache; lazy routes; no premature memo |
| 17 | Clear reasoning | [architecture.md](./architecture.md), [frontend.md](./frontend.md), [practices.md](./practices.md) |

---

## Sample scenarios

| Scenario | Context JSON | Example ADR |
|----------|--------------|-------------|
| Startup, cost-focused | [startup-cost-optimized.json](./examples/scenarios/startup-cost-optimized.json) | [startup-cost-optimized.md](./examples/adrs/startup-cost-optimized.md) |
| Enterprise compliance | [enterprise-compliance.json](./examples/scenarios/enterprise-compliance.json) | [enterprise-compliance.md](./examples/adrs/enterprise-compliance.md) |

Paste context fields into the wizard or use the API as in [full-journey.md](./examples/flows/full-journey.md).
