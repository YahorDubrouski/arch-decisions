from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from arch_decisions.api.deps import EnqueueServiceDep
from arch_decisions.api.routes.recommendations_evaluate_docs import (
    EVALUATE_BODY,
    EVALUATE_DESCRIPTION,
    EVALUATE_RESPONSES,
    EVALUATE_SUMMARY,
    EvaluateBodyType,
)
from arch_decisions.api.schemas import (
    EvaluateRecommendationsRequestSchema,
    JobAcceptedSchema,
)
from arch_decisions.core.logging import get_logger
from arch_decisions.domain.context import ProjectContext

router = APIRouter(prefix="/recommendations", tags=["recommendations"])
logger = get_logger(__name__)


@router.post(
    "/evaluate",
    response_model=JobAcceptedSchema,
    status_code=status.HTTP_202_ACCEPTED,
    summary=EVALUATE_SUMMARY,
    description=EVALUATE_DESCRIPTION,
    responses=EVALUATE_RESPONSES,
)
def evaluate_recommendations(
    body: Annotated[EvaluateBodyType, EVALUATE_BODY],
    enqueue: EnqueueServiceDep,
) -> JSONResponse:
    context_schema = (
        body.context if isinstance(body, EvaluateRecommendationsRequestSchema) else body
    )

    context = ProjectContext.model_validate(context_schema.model_dump())
    logger.info(
        "Enqueueing recommendations evaluation job",
        teamSize=context.teamSize,
        trafficPattern=context.trafficPattern,
    )
    job_id = enqueue.enqueue_evaluate_recommendations(context)
    return JSONResponse(status_code=202, content=JobAcceptedSchema(jobId=job_id).model_dump())
