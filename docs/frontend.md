# Frontend architecture

For hiring managers and senior frontend reviewers. System context: [architecture.md](./architecture.md) · API: [reference.md](./reference.md).

---

## User journey

| Route | Role |
|-------|------|
| `/` | Entry |
| `/context` | 5-step wizard |
| `/recommendations` | Cards + generate ADR |
| `/architecture-decisions` | Document list |
| `/architecture-decisions/:id` | Summary / full / export |

Pages are thin composers; logic lives in `features/`.

---

## Folder layout

```text
frontend/src/
├── app/              # Router, providers, error boundary
├── pages/            # Route screens only
├── features/
│   ├── context/
│   ├── recommendations/      # + gateways/
│   └── architecture-decisions/  # + gateways/, seed/
├── domain/           # Zod schemas, pure helpers (no React, no fetch)
└── shared/           # httpClient, dataSource config, UI tokens
```

**Dependency rule:** `features` and `pages` may import `shared` and `domain`; `shared` must not import `features`.

---

## State ownership

| Kind | Tool | Example |
|------|------|---------|
| Form / wizard | `useState` in hooks | `useContextForm` |
| Server data | TanStack Query + gateways | `useArchitectureDecisionsQuery` |
| Cross-route session | `sessionStorage` + Zod on read | `contextStorage`, `recommendationsStorage` |

No Redux — three short flows; Query owns async server state.

---

## Gateways (data source)

```text
VITE_DATA_SOURCE → create*Gateway() → Http*Gateway | Local*Gateway
```

| Mode | Recommendations | ADRs |
|------|-----------------|------|
| `http` | POST evaluate → poll job → result | Same for generate; sync list/get |
| `local` | `evaluateRecommendationsLocally` | Template draft + `sessionStorage` |

UI never checks env; see [dataSource.ts](../frontend/src/shared/config/dataSource.ts) and feature [gateways/](../frontend/src/features/recommendations/gateways/).

---

## Async and errors

- Mutations: [useEvaluateRecommendationsMutation.ts](../frontend/src/features/context/hooks/useEvaluateRecommendationsMutation.ts), [useGenerateArchitectureDecisionMutation.ts](../frontend/src/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation.ts) — pending state, `resolveSubmitError`, navigation on success  
- Queries: explicit loading / error / empty in pages  
- HTTP: typed `postJson` / `getJson` + Zod at boundaries ([httpClient.ts](../frontend/src/shared/api/httpClient.ts))

---

## Styling and tests

- CSS Modules + design tokens ([shared/styles/](../frontend/src/shared/styles/))  
- Co-located tests under `__tests__/`; run via Docker: see [getting-started.md](./getting-started.md)

---

## Files to open first

1. [App.tsx](../frontend/src/app/App.tsx) — shell and providers  
2. [dataSource.ts](../frontend/src/shared/config/dataSource.ts)  
3. [recommendations/gateways/](../frontend/src/features/recommendations/gateways/) · [architecture-decisions/gateways/](../frontend/src/features/architecture-decisions/gateways/)  
4. [useEvaluateRecommendationsMutation.ts](../frontend/src/features/context/hooks/useEvaluateRecommendationsMutation.ts)  
5. [contextSchema.ts](../frontend/src/domain/contextSchema.ts)
