# Competency map

How this project demonstrates the 17 portfolio competencies. Each row links to concrete code or documentation.

## Architecture & platform (1–10)

| # | Competency | Demonstrated in |
|---|------------|-----------------|
| 1 | Architectural thinking | Layered backend (`controllers` → `services` → `integrations`); feature-based frontend; [Key decisions in README](../README.md#-key-architecture-decisions) |
| 2 | Decision-making under constraints | Rule-based + OpenAI decision providers; context-driven recommendations in `backend/src/services/recommendations/` |
| 3 | Explicit trade-offs | `TradeOffsGrid`, `calculateTradeOffs()`; alternatives on every `RecommendationCard` |
| 4 | Business impact awareness | Trade-off dimensions: cost, complexity, risk, operational overhead |
| 5 | Ownership of decisions | Documented stack choices (Node LTS, SQLite, Express, sessionStorage vs Redux) in README |
| 6 | Structuring ambiguous requirements | 5-step context wizard breaks vague “project needs” into typed fields |
| 7 | Clear written communication | README, [TECHNICAL_SPEC.md](../TECHNICAL_SPEC.md), [examples](./examples/) |
| 8 | Pragmatic DevOps | Docker compose (root + per-service); Knex migrations; `STORAGE_PROVIDER` switch |
| 9 | AI as decision-support | Template default + optional OpenAI for ADR generation; not AI-for-everything |
| 10 | Architecture Decision Records | Generate, store, view summary/full, export markdown |

## Frontend / React (11–17)

| # | Competency | Demonstrated in |
|---|------------|-----------------|
| 11 | React application architecture | `app/`, `pages/`, `features/`, `domain/`, `shared/` — not a flat components tree |
| 12 | State management boundaries | Form state in hooks; server state in TanStack Query; session persistence in feature services |
| 13 | Separation of concerns | Domain schemas pure; HTTP in `shared/api`; UI in feature components |
| 14 | Async orchestration | `useEvaluateRecommendationsMutation`, `useArchitectureDecisionQuery`, loading/error/retry |
| 15 | Scalability & maintainability | One folder per feature; co-located tests; minimal cross-feature imports |
| 16 | Performance-aware patterns | CSS Modules; query caching via TanStack Query; thin page components |
| 17 | Clear reasoning WHY | README architecture decisions; feature folder rationale in [Project Structure](../README.md#-project-structure) |

## Feature → competency matrix

| Feature | Primary competencies |
|---------|---------------------|
| Context builder (`/context`) | 6, 11, 12, 13 |
| Recommendations (`/recommendations`) | 2, 3, 4, 11, 13 |
| ADR viewer (`/architecture-decisions/:id`) | 5, 7, 10, 11, 13 |
| Backend decision engine | 1, 2, 3, 5, 8 |
| ADR generation (template/OpenAI) | 9, 10 |
