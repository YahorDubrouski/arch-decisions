# Frontend README — Architecture Decisions Platform

> **Audience:** Frontend engineering recruiters and hiring managers.  
> **Full system context:** [README.md](./README.md) · [Technical spec](./TECHNICAL_SPEC.md) · [Competency map](./docs/COMPETENCY_MAP.md)

This document explains **how the React app is structured**, **why patterns were chosen**, and **where to look in the code** — not just which libraries we use.

---

## What the frontend does

A four-step user journey:

1. **Home** — entry and workflow overview  
2. **Context** (`/context`) — 5-step wizard, validated form state  
3. **Decisions** (`/decisions`) — read recommendations from session + generate ADR  
4. **ADR viewer** (`/architecture-decisions/:id`) — summary/full toggle, copy, download  

Pages are thin; business UI lives in **feature folders**.

---

## Application structure (not components-only)

```
frontend/src/
├── app/              # Router, providers, error boundary
├── pages/            # Route screens — compose features only
├── features/         # One folder per user flow
│   ├── context/
│   ├── decisions/
│   └── architecture-decisions/
├── domain/           # Zod schemas + pure validation (no React, no fetch)
└── shared/           # Layout, API client, design tokens, icons
```

**Why this layout**

| Choice | Rationale |
|--------|-----------|
| `pages/` stay thin | Routes change rarely; features evolve independently |
| `features/<name>/` | High cohesion — components, hooks, and services for one flow live together |
| `domain/` is framework-free | Validation rules are testable without rendering or HTTP mocks |
| `shared/` for cross-cutting only | Prevents a junk-drawer `components/` that every feature imports |

**Example — page as composer, not logic owner:**

```tsx
// pages/DecisionsPage.tsx — reads session, delegates actions to hooks
const decisions = getDecisions();
const { submit, isSubmitting, submitError } = useGenerateArchitectureDecisionMutation();
```

Competency **11** (React application architecture): structure reflects **user flows**, not file type alone.

---

## State management — three layers, explicit boundaries

We did **not** add Redux or Zustand. State is split by **lifetime** and **source of truth**:

| Layer | Tool | Holds | Example |
|-------|------|-------|---------|
| **UI / form** | `useState` in feature hooks | Wizard step, field values, inline errors | `useContextForm` |
| **Server** | TanStack Query | API data, loading, error, cache | `useArchitectureDecisionQuery` |
| **Session** | `sessionStorage` via feature services | Context + decisions between routes | `contextStorage`, `decisionsStorage` |

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
// features/context/hooks/useEvaluateDecisionsMutation.ts
const mutation = useMutation({
  mutationFn: (context: ProjectContext) => evaluateDecisions(context),
  onSuccess: (decisions, context) => {
    saveProjectContext(context);
    saveDecisions(decisions);
    navigate('/decisions');
  },
});
```

**Session read with schema guard:**

```tsx
// features/decisions/services/decisionsStorage.ts
const parsed = decisionsResponseSchema.safeParse(JSON.parse(rawValue));
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
  queryFn: () => fetchArchitectureDecisionById(decisionId!),
  enabled: Boolean(decisionId),
});
```

Pages branch on `isLoading`, `isError`, and `data` — no ad-hoc `useEffect` fetch chains.

### Mutations (write)

`useEvaluateDecisionsMutation` and `useGenerateArchitectureDecisionMutation` expose:

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
<Route path="/decisions" element={<DecisionsPage/>}/>
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
- Code splitting / lazy routes — four pages; bundle is already small  
- Virtualized ADR rendering — documents are short markdown strings  

Competencies **15–16**: maintainability via structure and boundaries, not micro-optimizations.

---

## Frontend competencies (11–17)

| # | Competency | Where in this repo |
|---|------------|-------------------|
| 11 | React application architecture | `app/`, `pages/`, `features/`, `domain/`, `shared/` |
| 12 | State management strategy | `useContextForm`, TanStack Query, `*Storage` services |
| 13 | Separation of concerns | Domain schemas, feature services, thin pages |
| 14 | Async orchestration | `useEvaluateDecisionsMutation`, `useArchitectureDecisionQuery`, `httpClient` |
| 15 | Scalability / maintainability | Feature-based folders, co-located tests, CSS Modules |
| 16 | Performance-aware patterns | Query cache, scoped CSS, intentional omission of premature memoization |
| 17 | Clear reasoning WHY | This document + [COMPETENCY_MAP.md](./docs/COMPETENCY_MAP.md) |

---

## Key files to read first

1. `frontend/src/app/App.tsx` — providers + shell  
2. `frontend/src/features/context/hooks/useContextForm.ts` — local form state  
3. `frontend/src/features/context/hooks/useEvaluateDecisionsMutation.ts` — mutation + persistence  
4. `frontend/src/pages/DecisionsPage.tsx` — composing session + mutation  
5. `frontend/src/shared/api/httpClient.ts` — HTTP + error mapping  
6. `frontend/src/domain/contextSchema.ts` — domain validation  

---

## Running the frontend

```bash
# With Docker (recommended)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Frontend only
cd frontend && npm install && npm run dev
```

Set `VITE_API_URL` when the backend runs on a different origin (default: same-origin / Vite proxy).

---

## Related documentation

- [Main README](./README.md) — platform vision and architecture decisions  
- [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) — API contracts  
- [docs/examples/flows/full-journey.md](./docs/examples/flows/full-journey.md) — UI walkthrough  
