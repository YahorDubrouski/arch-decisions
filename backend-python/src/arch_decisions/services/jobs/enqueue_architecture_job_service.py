from __future__ import annotations

from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.infrastructure.queue.architecture_job_types import ArchitectureJobTypes
from arch_decisions.infrastructure.queue.job_registry import register_job


class EnqueueArchitectureJobService:
    def enqueue_evaluate_recommendations(self, context: ProjectContext) -> str:
        from arch_decisions.workers.tasks import evaluate_recommendations_task

        async_result = evaluate_recommendations_task.delay(context.model_dump())
        job_id = str(async_result.id)
        register_job(job_id, ArchitectureJobTypes.EVALUATE_RECOMMENDATIONS)
        return job_id

    def enqueue_generate_architecture_decision(
        self,
        context: ProjectContext,
        recommendations: RecommendationsResponse,
    ) -> str:
        from arch_decisions.workers.tasks import generate_architecture_decision_task

        async_result = generate_architecture_decision_task.delay(
            context.model_dump(),
            recommendations.model_dump(),
        )
        job_id = str(async_result.id)
        register_job(job_id, ArchitectureJobTypes.GENERATE_ARCHITECTURE_DECISION)
        return job_id
