from __future__ import annotations

import asyncio
from typing import Any

from arch_decisions.celery_app import celery_app
from arch_decisions.core.logging import get_logger
from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.infrastructure.queue.architecture_job_types import ArchitectureJobTypes

logger = get_logger(__name__)


def _run(coro: Any) -> Any:
    return asyncio.run(coro)


@celery_app.task(name=ArchitectureJobTypes.GENERATE_ARCHITECTURE_DECISION, bind=True)
def generate_architecture_decision_task(
    self: Any,
    context_payload: dict[str, Any],
    recommendations_payload: dict[str, Any],
) -> dict[str, Any]:
    from arch_decisions.container import build_worker_container

    logger.info("Processing generate-architecture-decision job", jobId=self.request.id)
    container = build_worker_container()
    context = ProjectContext.model_validate(context_payload)
    recommendations = RecommendationsResponse.model_validate(recommendations_payload)
    architecture_decision = _run(
        container.generate_architecture_decision_service.generate(context, recommendations)
    )
    return {"architectureDecision": architecture_decision.model_dump()}
