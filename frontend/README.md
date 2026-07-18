# Architecture Decisions — Frontend

React app for the context wizard, recommendations, and ADR documents.

**Audience:** hiring managers reviewing **senior React** structure — feature folders, state ownership, gateways (`http` \| `local`).

Works with the [Express](../backend/README.md) or [Python](../backend-python/README.md) API, or **standalone** with `VITE_DATA_SOURCE=local` (sessionStorage + in-browser rules/templates — no backend).

---

## What you get

1. **Context wizard** — multi-step validated form  
2. **Recommendations** — compute / secrets / CI/CD with trade-offs  
3. **ADR list + detail** — filters, pagination (URL state), summary/full, export  

Stack: React 19 · TypeScript · Vite · TanStack Query · React Router · Zod · Vitest · CSS Modules.

---

## Quick start (Docker)

From the **monorepo root**:

```bash
make docker-up
```

| Service | URL |
|---------|-----|
| Frontend (dev) | http://localhost:5174 |

Point at Express (`VITE_API_URL=http://localhost:3001`) or Python (`http://localhost:3002`), or set `VITE_DATA_SOURCE=local` for UI-only.

Stop: `make docker-down`

Details: [docs/getting-started.md](../docs/getting-started.md) · [docs/frontend.md](../docs/frontend.md)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [../docs/README.md](../docs/README.md) | Monorepo docs index |
| [../docs/frontend.md](../docs/frontend.md) | React layout, state, gateways |
| [../docs/getting-started.md](../docs/getting-started.md) | Run stack, frontend-only / Cloudflare notes |
| [../docs/architecture.md](../docs/architecture.md) | Provider matrix (`VITE_DATA_SOURCE`) |
| [../docs/practices.md](../docs/practices.md) | **React must-haves + code proof** |
| [../docs/for-reviewers.md](../docs/for-reviewers.md) | 5-minute review path |
| [../docs/examples/flows/full-journey.md](../docs/examples/flows/full-journey.md) | End-to-end UI walkthrough |
| [../docs/screenshots/](../docs/screenshots/) | UI captures |
| [../README.md](../README.md) | Monorepo landing |

---

## Highlights

- **`VITE_DATA_SOURCE`** — `http` (API) or `local` (browser-only); gateways, not pages, branch on env  
- **State ownership** — form / Query / URL / session / derived  
- **Thin pages** — loading → error → empty → success  

Full evidence: [../docs/practices.md](../docs/practices.md).

---

## Layout

```text
src/
├── app/           # router, providers
├── pages/         # thin route screens
├── features/      # context | recommendations | architecture-decisions
├── domain/        # Zod + pure helpers
└── shared/        # httpClient, dataSource, UI
```

---

## Cloudflare Workers (static SPA)

Deploy the Vite `dist/` folder as Workers static assets (no Express/Python).

1. **Repo** — `wrangler.toml` points `[assets]` at `./dist` with SPA `not_found_handling` (deep links → `index.html`). Do **not** add a Pages-style `public/_redirects` SPA rule — Workers rejects it as an infinite loop.
2. **Dashboard** (Workers & Pages → this project → Settings → Build):

| Field | Value |
|-------|--------|
| Path | `/frontend/` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Do **not** use `npx wrangler pages deploy` on a Workers project (dashboard may reject with “Invalid request body”).

3. **Environment variables** (Build / production): set `VITE_DATA_SOURCE=local`. Omit `VITE_API_URL`.

After merging these files to `main`, re-run the failed build (or push a commit).

---

## License

Portfolio / demonstration package (part of the arch-decisions monorepo).
