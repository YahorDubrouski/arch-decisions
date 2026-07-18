# Documentation

Monorepo product docs (UI + both backends).

| Read this | When you need |
|-----------|----------------|
| [getting-started.md](./getting-started.md) | Run locally, run tests, verify providers |
| [architecture.md](./architecture.md) | Design decisions and configuration model |
| [reference.md](./reference.md) | API contracts and env vars |
| [frontend.md](./frontend.md) | React layout, state, gateways |
| [practices.md](./practices.md) | **Must-have checklists with proof** + full practice → code map |
| [for-reviewers.md](./for-reviewers.md) | Fast evaluation path for hiring |
| [examples/](./examples/) | Sample JSON contexts and ADR markdown |
| [screenshots/](./screenshots/) | UI capture catalog |

### Standalone backend docs

Reviewers who care about **one** stack can start here:

| Backend | Landing | Docs |
|---------|---------|------|
| Express | [../backend/README.md](../backend/README.md) | [../backend/docs/](../backend/docs/) |
| Python | [../backend-python/README.md](../backend-python/README.md) | [../backend-python/docs/](../backend-python/docs/) |

**Suggested order for reviewers:** [for-reviewers.md](./for-reviewers.md) → run app → [practices.md](./practices.md) → [full journey](./examples/flows/full-journey.md) → skim [architecture.md](./architecture.md) — or jump straight into a backend package’s [for-reviewers](../backend/docs/for-reviewers.md) / [Python for-reviewers](../backend-python/docs/for-reviewers.md).
