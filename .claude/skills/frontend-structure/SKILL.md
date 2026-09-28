---
name: frontend-structure
description: >
  Places new arch-decisions frontend files in the hybrid feature layout.
  Use when adding React components, hooks, services, pages, styles, or tests
  under frontend/src. Match existing folders. Do not add a new top-level layer.
---

# Frontend structure

Use the hybrid feature-based layout. Paths below are under `frontend/src/`. Match existing folders before inventing new top-level ones.

## Where new code goes

| Layer | Path | Put here |
|-------|------|----------|
| App wiring | `app/` | Router, providers, global app shell |
| Routes | `pages/` | One screen per route. Thin. Compose features only |
| Feature UI | `features/<name>/components/` | Components for one user flow, co-located `*.module.css`, and `__tests__/` |
| Feature state | `features/<name>/hooks/` | Stateful logic for that feature, plus `__tests__/` |
| Feature API | `features/<name>/services/` | API calls for that feature. Use `shared/api/httpClient` |
| Shared business | `domain/` | Cross-feature types and pure rules. No React, no fetch |
| Shared infra | `shared/` | `api/`, `styles/`, future generic UI kit |
| Test setup | `test/` | Vitest setup only (jest-dom, cleanup) |

## Rules

- Pages stay thin. No business logic and no direct `fetch` in `pages/`. Delegate to `features/*/hooks` and `features/*/services`.
- Co-locate styles. `ComponentName.module.css` next to the component or page. Global CSS only in `shared/styles/` (tokens, reset).
- Co-locate tests. `__tests__/` inside the feature folder, next to the code under test.
- A new user flow gets `features/<flow-name>/` with `components/`, `hooks/`, and `services/` as needed, a route in `app/routes.tsx`, and a page in `pages/`.
- Do not add top-level `components/`, `hooks/`, or `services/` at `frontend/src/`. That is the old layered layout.

## Data flow

`pages/` to `features/<name>/` (components and hooks) to `features/<name>/services/` or `shared/api/` to `domain/`.

## Styling

- Global: `shared/styles/tokens.css` and `shared/styles/reset.css`, imported from `main.tsx`.
- Scoped: `import styles from './X.module.css'` and `className={styles.foo}`.
