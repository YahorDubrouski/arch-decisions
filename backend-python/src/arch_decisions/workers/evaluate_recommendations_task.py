from __future__ import annotations

import asyncio
from typing import Any

from arch_decisions.celery_app import celery_app
from arch_decisions.core.logging import get_logger
from arch_decisions.domain.context import ProjectContext
from arch_decisions.infrastructure.queue.architecture_job_types import ArchitectureJobTypes

logger = get_logger(__name__)


def _run(coro: Any) -> Any:
    return asyncio.run(coro)


@celery_app.task(name=ArchitectureJobTypes.EVALUATE_RECOMMENDATIONS, bind=True)
def evaluate_recommendations_task(self: Any, context_payload: dict[str, Any]) -> dict[str, Any]:
    from arch_decisions.container import build_worker_container

    logger.info("Processing evaluate-recommendations job", jobId=self.request.id)
    container = build_worker_container()
    context = ProjectContext.model_validate(context_payload)
    recommendations = _run(container.evaluate_recommendations_service.evaluate_all(context))
    return {"recommendations": recommendations.model_dump()}
