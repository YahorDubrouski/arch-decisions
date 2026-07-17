# Frontend README — Architecture Decisions Platform

> **Audience:** Frontend engineering recruiters and hiring managers.  
> **Full system context:** [README.md](./README.md) · [Technical spec](./TECHNICAL_SPEC.md) · [Competency map](./docs/COMPETENCY_MAP.md)

This document explains **how the React app is structured**, **why patterns were chosen**, and **where to look in the code** — not just which libraries we use.

---

## What the frontend does

A four-step user journey:

1. **Home** — entry and workflow overview  
2. **Context** (`/context`) — 5-step wizard, validated form state  
3. **Recommendations** (`/recommendations`) — read recommendations from session + generate ADR  
4. **ADR viewer** (`/architecture-decisions/:id`) — summary/full toggle, copy, download  

Pages are thin; business UI lives in **feature folders**.

### UI showcase

| | |
|-|-|
| ![Home](./docs/screenshots/01-home.png) | ![Recommendations](./docs/screenshots/03-recommendations.png) |
| ![Documents](./docs/screenshots/04-documents-grid.png) | ![ADR](./docs/screenshots/06-adr-full.png) |

---

## Application structure (not components-only)

```
frontend/src/
├── app/              # Router, providers, error boundary
├── pages/            # Route screens — compose features only
├── features/         # One folder per user flow
│   ├── context/
│   ├── recommendations/          # + gateways/ (Http | Local)
│   └── architecture-decisions/   # + gateways/, seed/
├── domain/           # Zod schemas + pure validation (no React, no fetch)
└── shared/           # Layout, API client, config (`dataSource`), design tokens
```

**Why this layout**

| Choice | Rationale |
|--------|-----------|
| `pages/` stay thin | Routes change rarely; features evolve independently |
| `features/<name>/` | High cohesion — components, hooks, and gateways for one flow live together |
| `gateways/` | Port + adapters: UI depends on a stable interface; `http` vs `local` is a factory choice |
| `domain/` is framework-free | Validation rules are testable without rendering or HTTP mocks |
| `shared/` for cross-cutting only | Prevents a junk-drawer `components/` that every feature imports |

**Example — page as composer, not logic owner:**

```tsx
// pages/RecommendationsPage.tsx — reads session, delegates actions to hooks
const recommendations = getRecommendations();
const { submit, isSubmitting, submitError } = useGenerateArchitectureDecisionMutation();
```

Competency **11** (React application architecture): structure reflects **user flows**, not file type alone.

---

## State management — three layers, explicit boundaries

We did **not** add Redux or Zustand. State is split by **lifetime** and **source of truth**:

| Layer | Tool | Holds | Example |
|-------|------|-------|---------|
| **UI / form** | `useState` in feature hooks | Wizard step, field values, inline errors | `useContextForm` |
| **Server / remote** | TanStack Query + gateways | API (or local adapter) data, loading, error, cache | `useArchitectureDecisionQuery` → `architectureDecisionGateway` |
| **Session** | `sessionStorage` via feature storage | Context + recommendations between routes | `contextStorage`, `recommendationsStorage` |

### Why not Redux?

- Three small flows, no shared optimistic UI across ten screens  
- Redux would add boilerplate without demonstrating better **boundaries**  
- TanStack Query already owns async server state (the hard part Redux often absorbs poorly)

### Why sessionStorage (not a global client store)?

- Portfolio demo: survive refresh within a tab, no auth, no multi-user  
- Typed read/write in feature services with Zod validation on read  
- Clear upgrade path: swap `sessionStorage` for API-backed persistence later without touching UI

**Form state — local until submit:**

```tsx
// features/context/hooks/useContextForm.ts
const [context, setContext] = useState<Partial<ProjectContext>>({});
const [currentStep, setCurrentStep] = useState(1);

function nextStep() {
  if (isStepValid(currentStep, context)) {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  } else {
    setErrors(validateStep(currentStep, context));
  }
}
```

**Server state — mutation with side effects:**

```tsx
// features/context/hooks/useEvaluateRecommendationsMutation.ts
const mutation = useMutation({
  mutationFn: (context: ProjectContext) => recommendationsGateway.evaluateAll(context),
  onSuccess: (recommendations, context) => {
    saveProjectContext(context);
    saveRecommendations(recommendations);
    navigate('/recommendations');
  },
});
```

**Session read with schema guard:**

```tsx
// features/recommendations/services/recommendationsStorage.ts
const parsed = recommendationsResponseSchema.safeParse(JSON.parse(rawValue));
return parsed.success ? parsed.data : null;
```

Competency **12** (state boundaries): form ≠ server ≠ session; each has one job.

---

## Separation of concerns

```
UI component  →  feature hook  →  feature service  →  shared/httpClient  →  API
                      ↓
                 domain schema (Zod)
```

| Layer | Must not |
|-------|----------|
| `domain/` | Import React, call `fetch`, know about routes |
| `shared/api/httpClient.ts` | Know business rules |
| `pages/` | Call `fetch` directly or embed validation rules |
| Feature `services/` | Render JSX |

**Domain-driven validation** — rules live in Zod, reused by form steps:

```tsx
// domain/contextSchema.ts
export const projectContextSchema = z.object({
  teamSize: teamSizeSchema,
  trafficPattern: trafficPatternSchema,
  // ...
});
```

Competency **13** (separation): domain, infrastructure, and UI are import-directional.

---

## Async data & error handling

### Queries (read)

```tsx
// features/architecture-decisions/hooks/useArchitectureDecisionQuery.ts
return useQuery({
  queryKey: ['architecture-decision', decisionId],
  queryFn: () => architectureDecisionGateway.getById(decisionId!),
  enabled: Boolean(decisionId),
});
```

Pages branch on `isLoading`, `isError`, and `data` — no ad-hoc `useEffect` fetch chains.

### Mutations (write)

`useEvaluateRecommendationsMutation` and `useGenerateArchitectureDecisionMutation` expose:

- `isSubmitting` / `isPending` for button disabled state  
- `submitError` mapped through `resolveSubmitError`  
- `resetSubmitError` for retry  

### HTTP client — one place for failures

```tsx
// shared/api/httpClient.ts
export function resolveSubmitError(error: unknown): string {
  if (error instanceof HttpClientError) {
    if (error.status >= 500) return 'Server error. Please try again.';
    return error.message;
  }
  if (error instanceof TypeError) {
    return 'Could not reach the server. Check that backend is running.';
  }
  // ...
}
```

Responses are validated with Zod at the boundary (`postJson` + response schemas).

**Query defaults** — intentional for a demo app:

```tsx
// app/providers/queryClient.ts
retry: false,
refetchOnWindowFocus: false,
```

Competency **14** (async orchestration): loading/error/retry are first-class in hooks, not scattered in pages.

---

## Routing & providers

```tsx
// app/routes.tsx
<Route path="/context" element={<ContextBuilderPage/>}/>
<Route path="/recommendations" element={<RecommendationsPage/>}/>
<Route path="/architecture-decisions/:decisionId" element={<ArchitectureDecisionPage/>}/>
```

```tsx
// app/providers/AppProviders.tsx
<QueryClientProvider client={queryClient}>
  <BrowserRouter>{children}</BrowserRouter>
</QueryClientProvider>
```

`AppShell` (header, nav, footer) wraps all routes — layout is not duplicated per page.

---

## Styling approach

- **Design tokens** — `shared/styles/tokens.css` (colors, spacing, typography)  
- **CSS Modules** — co-located `*.module.css` per component/page (local scope, no runtime cost)  
- **Shared UI primitives** — `shared/styles/ui.module.css` (buttons, panels, badges)  

No CSS-in-JS library — keeps bundle small and styles grep-friendly.

---

## Testing strategy

| What | Where | Why |
|------|-------|-----|
| Step components | `features/context/components/__tests__/` | User input + validation messages |
| Hooks | `features/context/hooks/__tests__/` | Form logic without full page |
| Pages | `pages/__tests__/` | Integration: submit → navigate, empty states |
| Storage / export | `services/__tests__/`, `utils/__tests__/` | Pure behavior |

Tests run in Docker: `docker-compose ... exec frontend npm run test` (74 tests).

---

## Performance & maintainability

**What we do**

- TanStack Query caches GET responses by `queryKey`  
- CSS Modules — no global class collisions as features grow  
- Feature folders — delete or add a flow without touching unrelated code  
- Zod at API and storage boundaries — corrupt data fails safely  

**What we deliberately skipped** (portfolio scope)

- `useMemo` / `useCallback` everywhere — list sizes are tiny; premature  
- Code splitting / lazy routes — each page in `app/routes.tsx` is `React.lazy`’d with `Suspense` + `PageFallback` (code load ≠ API load)
- Virtualized ADR rendering — documents are short markdown strings  

Competencies **15–16**: maintainability via structure and boundaries, not micro-optimizations.

---

## Frontend competencies (11–17)

| # | Competency | Where in this repo |
|---|------------|-------------------|
| 11 | React application architecture | `app/`, `pages/`, `features/`, `domain/`, `shared/` |
| 12 | State management strategy | `useContextForm`, TanStack Query, `*Storage` services |
| 13 | Separation of concerns | Domain schemas, feature services, thin pages |
| 14 | Async orchestration | `useEvaluateRecommendationsMutation`, `useArchitectureDecisionQuery`, `httpClient` |
| 15 | Scalability / maintainability | Feature-based folders, co-located tests, CSS Modules |
| 16 | Performance-aware patterns | Query cache; route-level `lazy`/`Suspense` in `app/routes.tsx`; no premature memoization |
| 17 | Clear reasoning WHY | This document + [COMPETENCY_MAP.md](./docs/COMPETENCY_MAP.md) |

---

## Key files to read first

1. `frontend/src/app/App.tsx` — providers + shell  
2. `frontend/src/shared/config/dataSource.ts` — `VITE_DATA_SOURCE` selection  
3. `frontend/src/features/recommendations/gateways/` — port + Http/Local adapters  
4. `frontend/src/features/architecture-decisions/gateways/` — port + Http/Local adapters  
5. `frontend/src/features/context/hooks/useEvaluateRecommendationsMutation.ts` — mutation via gateway  
6. `frontend/src/shared/api/httpClient.ts` — HTTP + error mapping  
7. `frontend/src/domain/contextSchema.ts` — domain validation  

---

## Data source strategy (`VITE_DATA_SOURCE`)

Hooks call feature **gateways**. The factory reads env once:

```txt
VITE_DATA_SOURCE=http|local  (default: http)

hooks → recommendationsGateway / architectureDecisionGateway
     → create*Gateway(getDataSource())
     → Http*Gateway  |  Local*Gateway
```

| Mode | Recommendations | Architecture decisions |
|------|-----------------|------------------------|
| `http` | `POST /api/recommendations/evaluate` → `202` + poll `GET /api/jobs/:jobId` | Same async pattern for generate; sync list/get |
| `local` | In-browser rules (same as backend mock) | Template ADR + `sessionStorage` list/get; seeds demo docs when empty |

Future remote backends (any language) only need the same HTTP JSON contract — the `Http*Gateway` stays unchanged.

**Example — Compose env:**

```yaml
# docker-compose.dev.yml
environment:
  - VITE_API_URL=http://localhost:3001
  - VITE_DATA_SOURCE=http   # or local for frontend-only demos
```

---

## Running the frontend

```bash
# With Docker (recommended)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Frontend only
cd frontend && npm install && npm run dev
```

- `VITE_API_URL` — backend origin when using `http` (default: same-origin / Vite proxy)
- `VITE_DATA_SOURCE` — `http` (default) or `local`

---

## Related documentation

- [Main README](./README.md) — platform vision and architecture decisions  
- [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) — API contracts  
- [docs/examples/flows/full-journey.md](./docs/examples/flows/full-journey.md) — UI walkthrough  
