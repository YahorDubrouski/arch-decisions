# Practices — Python backend

Evidence catalog: **what was implemented**, **why it matters**, and **where to look in code**.

Use after the [5-minute review path](./for-reviewers.md).

---

## Must-have checklist (with proof)

| # | Rule | Proof |
|---|------|-------|
| 1 | **Thin HTTP layer** | [recommendations.py](../src/arch_decisions/api/routes/recommendations.py) |
| 2 | **Services hold use cases** | [services/](../src/arch_decisions/services/) |
| 3 | **Factories + fail loud** | [recommendation_provider_factory.py](../src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py) |
| 4 | **Pydantic at boundaries** | [context.py](../src/arch_decisions/domain/context.py) · route validation |
| 5 | **Composition root + Depends** | [container.py](../src/arch_decisions/container.py) · [deps.py](../src/arch_decisions/api/deps.py) |
| 6 | **Celery worker split** | [tasks.py](../src/arch_decisions/workers/tasks.py) · [evaluate_recommendations_task.py](../src/arch_decisions/workers/evaluate_recommendations_task.py) |
| 7 | **PostgreSQL + Alembic** | [models.py](../src/arch_decisions/infrastructure/db/models.py) · [alembic/versions/](../alembic/versions/) |
| 8 | **OpenAI retries** | [openai_gateway.py](../src/arch_decisions/infrastructure/openai/openai_gateway.py) |
| 9 | **Correlation ID + errors** | [correlation_id.py](../src/arch_decisions/api/middleware/correlation_id.py) · [errors.py](../src/arch_decisions/core/errors.py) |
| 10 | **Provider matrix smoke** | [verify_provider_matrix.py](../scripts/verify_provider_matrix.py) |
| 11 | **pytest suite** | [tests/unit/](../tests/unit/) |
| 12 | **HTTP API integration tests** (TestClient) | [tests/api/](../tests/api/) |
| 13 | **OpenAPI / Swagger UI** | [api/schemas/](../src/arch_decisions/api/schemas/) · `*_docs.py` · FastAPI `/docs` · [screenshot](./screenshots/08-swagger-python.png) |
| 14 | **Config split by concern** | [core/config/](../src/arch_decisions/core/config/) |
| 15 | **Domain ≠ DB models** | [domain/architecture_decision.py](../src/arch_decisions/domain/architecture_decision.py) · [db/models.py](../src/arch_decisions/infrastructure/db/models.py) |

---

## Layering and composition

| Practice | Where to check |
|----------|----------------|
| Routes → services → infrastructure | [api/routes/](../src/arch_decisions/api/routes/) · [services/](../src/arch_decisions/services/) · [infrastructure/](../src/arch_decisions/infrastructure/) |
| Protocols for ports | [architecture_decision_repository.py](../src/arch_decisions/infrastructure/storage/architecture_decision_repository.py) |
| FastAPI deps | [deps.py](../src/arch_decisions/api/deps.py) |

---

## Strategy pattern (providers) — fail loud

| Practice | Where to check |
|----------|----------------|
| Recommendation `mock` \| `openai` | [recommendation_provider_factory.py](../src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py) |
| ADR `template` \| `openai` | [architecture_decision_provider_factory.py](../src/arch_decisions/infrastructure/openai/architecture_decision_provider_factory.py) |
| Storage `postgres` \| `memory` | [architecture_decision_repository_factory.py](../src/arch_decisions/infrastructure/storage/architecture_decision_repository_factory.py) |
| Matrix smoke | [verify_provider_matrix.py](../scripts/verify_provider_matrix.py) |

---

## Async jobs (Celery)

| Practice | Where to check |
|----------|----------------|
| Celery app + Redis | [celery_app.py](../src/arch_decisions/celery_app.py) |
| Task modules | [workers/](../src/arch_decisions/workers/) |
| Enqueue + poll | [enqueue_architecture_job_service.py](../src/arch_decisions/services/jobs/enqueue_architecture_job_service.py) · [jobs.py](../src/arch_decisions/api/routes/jobs.py) |

---

## Suggested deep-dive order

1. [container.py](../src/arch_decisions/container.py) · [deps.py](../src/arch_decisions/api/deps.py)  
2. [recommendation_provider_factory.py](../src/arch_decisions/infrastructure/openai/recommendation_provider_factory.py)  
3. [evaluate_recommendations_task.py](../src/arch_decisions/workers/evaluate_recommendations_task.py)  
4. [postgres_architecture_decision_repository.py](../src/arch_decisions/infrastructure/storage/postgres_architecture_decision_repository.py)  
5. Open Swagger: http://localhost:3002/docs  

Companion: [architecture.md](./architecture.md) · [for-reviewers.md](./for-reviewers.md)
