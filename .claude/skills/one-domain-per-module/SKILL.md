---
name: one-domain-per-module
description: >
  Keeps each arch-decisions source and test module to one business domain.
  Use when adding fixtures, tests, API schemas, routes, OpenAPI docs, or
  config modules. Split a file if it defines two domains.
---

# One domain per module

Do not park unrelated business domains in the same file. A reader should open one folder or file and see one concept.

## Domains in this repo

Separate domains include:

- project context
- recommendations / evaluate
- architecture decisions / ADR generate, list, get
- jobs / job status
- health
- OpenAPI / swagger wiring
- storage / providers (each provider family)

Shared plumbing may live together: `conftest.py`, the DI container, error base types, logging helpers.

## Rules

1. Fixtures and test builders: one domain per file. `tests/fixtures/project_context.py` and `tests/fixtures/recommendations.py` stay separate. Do not build recommendations and ADRs inside `project_context.py`.
2. Unit and API tests: group by domain folder or one focused file. Prefer `tests/unit/recommendations/…` and `tests/api/architecture_decisions/…`. Do not put evaluate, generate, and jobs in one `test_services.py`.
3. API schemas: one domain per module. `api/schemas/recommendations.py` and `api/schemas/job.py`. Not one `schemas.py` with every model.
4. Routes and OpenAPI docs: keep the endpoint narrative next to that domain. Prefer `routes/<domain>/` over a flat bag of `*_docs.py`. Express uses `routes/<domain>/*.route.ts` plus `*.openapi.ts`. Mirror that in Python.
5. Configuration: one concern per config module, like Express `config/*.config.ts`. `core/config/openai.py`, `core/config/redis.py`, `core/config/storage.py`. Not one Settings class for OpenAI, Redis, storage, and every provider switch.
6. Barrel and index files may re-export multiple domains. `schemas/__init__.py`, `openapi/schemas/index.ts`, and `core/config/__init__.py` aggregate only. They do not define mixed domain logic.

## Before finishing

- If two teammates would search different folder names for the symbols in this file, split the file.
- If a filename names one domain (`project_context`) but exports another (`make_recommendations_response`), move the other export.
