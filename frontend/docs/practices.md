# Practices — Frontend (React)

Evidence catalog for the **Architecture Decisions** React package: **what was implemented**, **why it matters**, and **where to look in code**.

Use after the [5-minute review path](../../docs/for-reviewers.md). Companion: [frontend architecture](../../docs/frontend.md).

---

## Must-have checklist (with proof)

| # | Rule | Proof |
|---|------|-------|
| 1 | **Screen state order:** loading → error → empty → success | [ArchitectureDecisionsPage.tsx](../src/pages/ArchitectureDecisionsPage.tsx) |
| 2 | **Skeleton (or explicit loading UI)** while server data loads | [DocumentsGridSkeleton.tsx](../src/features/architecture-decisions/components/DocumentsGridSkeleton.tsx) |
| 3 | **ErrorState with retry** for expected API failures | [ErrorState.tsx](../src/shared/ui/ErrorState.tsx) · [ArchitectureDecisionPage.tsx](../src/pages/ArchitectureDecisionPage.tsx) |
| 4 | **EmptyState** with a next action | [EmptyState.tsx](../src/shared/ui/EmptyState.tsx) |
| 5 | **Server GETs via Query** — not ad-hoc `useEffect` + `fetch` | [useArchitectureDecisionsQuery.ts](../src/features/architecture-decisions/hooks/useArchitectureDecisionsQuery.ts) |
| 6 | **Every API param in `queryKey`** | Same query hook |
| 7 | **Mutations:** disable while pending, map errors, navigate/invalidate on success | [useEvaluateRecommendationsMutation.ts](../src/features/context/hooks/useEvaluateRecommendationsMutation.ts) · [useGenerateArchitectureDecisionMutation.ts](../src/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation.ts) |
| 8 | **No raw `fetch` in UI** — gateway / `httpClient` only | [httpClient.ts](../src/shared/api/httpClient.ts) · [HttpArchitectureDecisionGateway.ts](../src/features/architecture-decisions/gateways/HttpArchitectureDecisionGateway.ts) |
| 9 | **Correct state ownership** — form / server / URL / session / derived | [useContextForm.ts](../src/features/context/hooks/useContextForm.ts) · [useArchitectureDecisionsQuery.ts](../src/features/architecture-decisions/hooks/useArchitectureDecisionsQuery.ts) · [useArchitectureDecisionListFilters.ts](../src/features/architecture-decisions/hooks/useArchitectureDecisionListFilters.ts) · [contextStorage.ts](../src/features/context/services/contextStorage.ts) · [listFilters.ts](../src/features/architecture-decisions/domain/listFilters.ts) |
| 10 | **Derived values in render** — no `useEffect` to sync derived state | [listFilters.ts](../src/features/architecture-decisions/domain/listFilters.ts) (`paginateItems`) |
| 11 | **Thin pages; presentational lists take props** | [ArchitectureDecisionsPage.tsx](../src/pages/ArchitectureDecisionsPage.tsx) → [ArchitectureDecisionGrid.tsx](../src/features/architecture-decisions/components/ArchitectureDecisionGrid.tsx) |
| 12 | **Feature folders + shared UI only for generic blocks** | [features/](../src/features/) · [shared/ui/](../src/shared/ui/) |
| 13 | **Zod at boundaries** — forms / API / storage reads | [contextSchema.ts](../src/domain/contextSchema.ts) |
| 14 | **Accessible forms** — labels, invalid/described-by where errors show | [Step1TeamSize.tsx](../src/features/context/components/Step1TeamSize.tsx) |
| 15 | **Tests assert behavior** (roles / user events), not internal state | [ArchitectureDecisionsPage.test.tsx](../src/pages/__tests__/ArchitectureDecisionsPage.test.tsx) |
| 16 | **Lazy route code ≠ data loading** — Suspense for JS; Query for data | [routes.tsx](../src/app/routes.tsx) · [PageFallback.tsx](../src/app/PageFallback.tsx) |

---

## Architecture and boundaries

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Feature-based folders | One user flow per folder (components, hooks, gateways, domain) | [context/](../src/features/context/) · [recommendations/](../src/features/recommendations/) · [architecture-decisions/](../src/features/architecture-decisions/) |
| Thin pages | Pages compose hooks + feature UI; lists receive props | [ArchitectureDecisionsPage.tsx](../src/pages/ArchitectureDecisionsPage.tsx) |
| Domain without React | Zod schemas and pure calculators | [contextSchema.ts](../src/domain/contextSchema.ts) · [calculateTradeOffs.ts](../src/domain/calculateTradeOffs.ts) |
| Dependency direction | Pages/features → shared/domain; shared never imports features | [shared/](../src/shared/) |

---

## State ownership (which storage when)

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Form = local `useState` | Wizard step and fields live with the form owner | [useContextForm.ts](../src/features/context/hooks/useContextForm.ts#L10) |
| Server state = TanStack Query | Lists/detail from API with loading/error/cache keys | [useArchitectureDecisionsQuery.ts](../src/features/architecture-decisions/hooks/useArchitectureDecisionsQuery.ts#L11) |
| Session = `sessionStorage` + Zod | Cross-route workflow data, validated on read | [contextStorage.ts](../src/features/context/services/contextStorage.ts#L16) |
| URL state for lists | Search/status/page/pageSize shareable and refresh-safe | [useArchitectureDecisionListFilters.ts](../src/features/architecture-decisions/hooks/useArchitectureDecisionListFilters.ts#L50) |
| Derived during render | Pagination math — no syncing into state | [listFilters.ts](../src/features/architecture-decisions/domain/listFilters.ts#L23) |

---

## Strategy / ports (data source)

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Gateway port + adapters | UI depends on a stable interface; HTTP vs local is a factory choice | [createRecommendationsGateway.ts](../src/features/recommendations/gateways/createRecommendationsGateway.ts) |
| Explicit `VITE_DATA_SOURCE` | `http` \| `local` — no silent switch | [dataSource.ts](../src/shared/config/dataSource.ts) |
| Local parity | Same contracts offline (rules + template + session) | [LocalRecommendationsGateway.ts](../src/features/recommendations/gateways/LocalRecommendationsGateway.ts) |

---

## Async, HTTP, and UX

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Mutations: pending / error / navigate | Evaluate and generate with user-facing errors | [useEvaluateRecommendationsMutation.ts](../src/features/context/hooks/useEvaluateRecommendationsMutation.ts) |
| Job polling | Enqueue → poll → Zod-parse result | [enqueueAndWaitForJobResult.ts](../src/shared/api/enqueueAndWaitForJobResult.ts) |
| Shared HTTP client | Typed errors, abort detection | [httpClient.ts](../src/shared/api/httpClient.ts) |
| Explicit UI states | Loading / error / empty / success on list pages | [ArchitectureDecisionsPage.tsx](../src/pages/ArchitectureDecisionsPage.tsx) |
| Lazy routes + Suspense | Route-level code split | [routes.tsx](../src/app/routes.tsx) |

---

## Tests

| Practice | What it shows | Where to check |
|----------|---------------|----------------|
| Vitest + Testing Library | Behavior tests (`getByRole`, user-event), co-located `__tests__` | [ArchitectureDecisionsPage.test.tsx](../src/pages/__tests__/ArchitectureDecisionsPage.test.tsx) |

---

## Suggested deep-dive order

1. [createRecommendationsGateway.ts](../src/features/recommendations/gateways/createRecommendationsGateway.ts)  
2. [useArchitectureDecisionListFilters.ts](../src/features/architecture-decisions/hooks/useArchitectureDecisionListFilters.ts)  
3. [ArchitectureDecisionsPage.tsx](../src/pages/ArchitectureDecisionsPage.tsx)  
4. Live demo: https://arch-decisions.yahordubrouski.com/

Monorepo index (all packages): [docs/practices.md](../../docs/practices.md).
