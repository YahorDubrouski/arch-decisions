# React Best Practices Demonstrated in This Project

This project is designed to demonstrate **production-ready React architecture**, not just UI that works.

Companion docs:

- [README-FRONTEND.md](../README-FRONTEND.md) — deeper frontend narrative for hiring managers
- [COMPETENCY_MAP.md](./COMPETENCY_MAP.md) — architecture + frontend competency mapping
- [TECHNICAL_SPEC.md](../TECHNICAL_SPEC.md) — API contracts

---

## Architecture

### Feature-Based Structure

Implemented in:

- `frontend/src/app/` — providers, router, error boundary
- `frontend/src/pages/` — thin route screens
- `frontend/src/features/context|recommendations|architecture-decisions/` — UI + hooks + services per flow
- `frontend/src/domain/` — Zod schemas and pure validation (no React / no fetch)
- `frontend/src/shared/` — layout, API client, session helpers, design tokens, generic UI

Why it matters:

Features scale independently. Reviewers can open one folder and see the whole user flow without scanning a flat `components/` dump.

### Container vs Presentational

Implemented in:

- `frontend/src/pages/ArchitectureDecisionsPage.tsx` — owns query state, loading/error/empty
- `frontend/src/features/architecture-decisions/components/ArchitectureDecisionGrid.tsx` — receives rows via props
- `frontend/src/pages/RecommendationsPage.tsx` → `RecommendationCard` (presentational + local expand UI)

Why it matters:

Lists and cards stay testable and reusable; pages own orchestration.

### Dependency Direction

Implemented in:

- Pages/features import `@/shared/*` and `@/domain/*`
- `shared/` does **not** import `@/features/*` (enforced by convention; verified in audit)

Why it matters:

Shared UI stays portable. Business knowledge stays in features.

### Composition Over Complexity

Implemented in:

- Multi-step context wizard composed from `Step1…Step5` + `StepProgress`
- ADR viewer composed from `ViewToggle`, summary/full, `ExportActions`

Why it matters:

No inheritance trees, HOCs, or configuration engines — readable senior structure.

---

## State Ownership

### Local UI State (`useState`)

Implemented in:

- `features/context/hooks/useContextForm.ts` — wizard step + field values + errors
- `features/recommendations/components/RecommendationCard.tsx` — expand/collapse
- `pages/ArchitectureDecisionPage.tsx` — summary vs full view mode
- `features/architecture-decisions/components/ExportActions.tsx` — copy/download feedback

### Server State (TanStack Query)

Implemented in:

- `features/architecture-decisions/hooks/useArchitectureDecisionsQuery.ts`
- `features/architecture-decisions/hooks/useArchitectureDecisionQuery.ts`
- `app/providers/queryClient.ts`

Why it matters:

API cache, loading, and errors live in Query — not Redux.

### Derived State During Render

Implemented in:

- `useContextForm.ts` — `canSubmit = isContextComplete(context)`
- `RecommendationsPage.tsx` — `canGenerateArchitectureDecision = Boolean(recommendations && context)`

Why it matters:

No `useEffect` for derived form flags. The only `useEffect` in this feature area syncs draft filters with the **URL** (an external system), which is a valid effect use.

### URL State for List Filters

Implemented in:

- `features/architecture-decisions/hooks/useArchitectureDecisionListFilters.ts` — draft filters in local state; **applied** filters in the URL (`?search=&status=`)
- `pages/ArchitectureDecisionsPage.tsx` — filter form + grid
- `useArchitectureDecisionsQuery(appliedFilters)` — `queryKey: ['architecture-decisions', filters]`

Why it matters:

Filters survive refresh and are shareable. The query key includes every API filter parameter so cache entries stay correct.

### Form State Separate From Server State

Implemented in:

- Form: `useContextForm` local state until submit
- Server write: `useEvaluateRecommendationsMutation` → API → session persistence → navigate

### Session Persistence (Not Global Client Store)

Implemented in:

- `features/*/services/*Storage.ts`
- `shared/session/projectSession.ts` — clear all `arch-decisions:*` keys

Why it matters:

Avoids Redux/Zustand for a short multi-page demo. Documented trade-off in README-FRONTEND.

### `useRef` for Non-UI Mutation

Implemented in:

- Mutation hooks hold `AbortController` in `useRef` so abort does not force extra UI state machines

### URL State

- Path params for document detail (`/architecture-decisions/:decisionId`)
- Search params for list filters on `/architecture-decisions` (`?search=` / `?status=`) — see **URL State for List Filters** above

---

## Data Fetching and Server State

### Typed API Services + Zod Boundary

Implemented in:

- `shared/api/httpClient.ts` — typed `getJson` / `postJson`, `HttpClientError`, abort options
- `features/architecture-decisions/gateways/` — `ArchitectureDecisionGateway` + Http/Local adapters
- `features/recommendations/gateways/` — `RecommendationsGateway` + Http/Local adapters
- `shared/config/dataSource.ts` — `VITE_DATA_SOURCE=http|local`
- `domain/*Schema.ts` — runtime validation of API/session payloads

### Feature Query Hooks + Complete `queryKey`

Implemented in:

- `useArchitectureDecisionsQuery` — `queryKey: ['architecture-decisions', filters]`
- `useArchitectureDecisionQuery` — `queryKey: ['architecture-decision', decisionId]` + `enabled`

### Explicit UI States

Implemented in:

- `ArchitectureDecisionsPage.tsx` — loading / error+retry / empty+CTA / success list
- `ArchitectureDecisionPage.tsx` — loading / error+retry / success document
- `shared/ui/EmptyState.tsx`, `shared/ui/ErrorState.tsx`

### Lists Independent of Data Source

Implemented in:

- `ArchitectureDecisionGrid` — presentational table; page owns the query and passes rows as props

### Filterable Documents Grid

Implemented in:

- `ArchitectureDecisionFilters` — labeled search + status, Apply / Clear
- `ArchitectureDecisionGrid` — semantic `<table>` with title links
- Backend `GET /api/architecture-decisions?search=&status=` — filters applied in the repository layer

---

## Mutations

Implemented in:

- `useEvaluateRecommendationsMutation.ts` — evaluate + session save + navigate; AbortController cancel
- `useGenerateArchitectureDecisionMutation.ts` — generate + `invalidateQueries(['architecture-decisions'])` + navigate; cancel

Why it matters:

Pending disables submit buttons; cancel aborts fetch; abort is not shown as a scary failure (`isAbortError`).

Success feedback: navigation to the next screen (and list invalidation) — not toast. Copy/download uses inline feedback text.

---

## Forms and Validation

### Controlled Wizard + Domain Zod (Not React Hook Form)

Implemented in:

- `domain/contextSchema.ts` — schemas + `z.infer` types + per-step validation
- `useContextForm.ts` + five step components
- `ContextBuilderPage.tsx` — `<form onSubmit={…}>`

Why not React Hook Form:

Five discrete steps with one field group each. Controlled `useState` is clearer and avoids library weight. RHF would be appropriate if fields grew nested/dynamic.

### Accessible Field Errors

Implemented in:

- Each step: `aria-invalid`, `aria-describedby`, error `role="alert"`
- Tests assert these attributes (`Step1TeamSize.test.tsx`, etc.)

---

## TypeScript

Implemented in:

- Explicit props types across feature components
- Typed `FormEvent` on context submit
- Typed service I/O + Zod schemas
- No `any` in `frontend/src`

External/runtime data: Zod at API and `sessionStorage` read boundaries.

---

## Accessibility

Implemented in:

- Semantic buttons/links (no clickable `div` for actions)
- Labeled selects (`htmlFor` / labels) in context steps
- `AppShell` nav: `aria-label`, `aria-current`
- RecommendationCard: `aria-expanded`, `aria-controls`
- ADR regions: `aria-label` on summary/full
- Focus rings: `shared/styles/reset.css` `:focus-visible`

No modal flows in this app — dialog a11y is **not applicable** unless a modal is added.

---

## Testing

Implemented in:

- Page tests: `pages/__tests__/*` — empty states, submit, cancel, navigation
- Step tests: `getByLabelText`, `aria-invalid`
- Hook tests: mutation success/error/cancel
- Prefer `getByRole` / `getByLabelText` / `getByText`

Why it matters:

Tests describe user-visible behavior, not private state.

---

## Performance

### Judgment: Avoid Premature Memoization

Intentionally **no** `useMemo` / `useCallback` / `React.memo` in app code — list sizes are tiny; Query caching handles refetch cost.

### Query Caching

Implemented in:

- TanStack Query defaults in `queryClient.ts`
- Mutation invalidates the documents list after generate

### Lazy Loading / Suspense

Implemented in:

- `frontend/src/app/routes.tsx` — each page is `React.lazy`’d into its own chunk
- `frontend/src/app/PageFallback.tsx` — Suspense fallback while the **route JS** loads

Why it matters:

- **Suspense** = code for the route is not ready yet (“Loading page…”)
- **TanStack Query `isLoading`** = page code is ready; **API data** is still loading

Do not use Suspense as a substitute for Query loading states.

### Query Caching

Implemented in:

- `app/ErrorBoundary.tsx` — unexpected render failures
- `ErrorState` + retry — expected API failures
- `resolveSubmitError` — distinguishes network / 4xx / 5xx / abort

Important screen failures are never toast-only (no toast library).

---

## Auth and Permissions

**Not applicable.** This is an unauthenticated portfolio demo. Adding login/`/me`/RBAC would invent scope without product need. Session storage holds wizard/decision draft data only — not identity.

---

## Planned Improvements

Intentionally deferred / not required:

- AbortSignal on GET-by-id (mutations already demonstrate abort)
- `aria-live` on export feedback (small a11y polish; not blocking)

Intentionally **not** planned (would add noise without product need):

- Redux / Zustand global store
- React Hook Form for the current wizard
- Virtualization (no large lists)
- Auth / permission system
- Toast library (navigation + inline feedback already cover UX)

---

## Quick map for reviewers

| Practice | Primary files |
|----------|----------------|
| Feature folders | `frontend/src/features/*` |
| Server state | `useArchitectureDecision(s)Query.ts` |
| Mutations + invalidate + abort | `use*Mutation.ts` |
| Form + Zod + a11y | `contextSchema.ts`, `Step*.tsx` |
| Error boundary | `app/ErrorBoundary.tsx` |
| Route lazy + Suspense | `app/routes.tsx`, `app/PageFallback.tsx` |
| Presentational grid + URL filters | `ArchitectureDecisionGrid.tsx`, `useArchitectureDecisionListFilters.ts` |
| Tests (behavior) | `pages/__tests__`, `features/**/__tests__` |
