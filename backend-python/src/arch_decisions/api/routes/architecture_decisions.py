from __future__ import annotations

from fastapi import APIRouter, Body, status
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from arch_decisions.api.deps import EnqueueServiceDep, RepositoryDep
from arch_decisions.api.routes.architecture_decisions_generate_docs import (
    GENERATE_DESCRIPTION,
    GENERATE_RESPONSES,
    GENERATE_SUMMARY,
)
from arch_decisions.api.routes.architecture_decisions_get_docs import GET_RESPONSES, GET_SUMMARY
from arch_decisions.api.routes.architecture_decisions_list_docs import (
    LIST_DESCRIPTION,
    LIST_RESPONSES,
    LIST_SEARCH_QUERY,
    LIST_STATUS_QUERY,
    LIST_SUMMARY,
)
from arch_decisions.api.schemas import (
    ArchitectureDecisionListResponseSchema,
    ArchitectureDecisionResponseSchema,
    GenerateArchitectureDecisionRequestSchema,
    JobAcceptedSchema,
)
from arch_decisions.core.errors import BadRequestError, NotFoundError
from arch_decisions.core.logging import get_logger
from arch_decisions.domain.architecture_decision import ArchitectureDecisionListFilters
from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse

router = APIRouter(prefix="/architecture-decisions", tags=["architecture-decisions"])
logger = get_logger(__name__)


@router.post(
    "/generate",
    response_model=JobAcceptedSchema,
    status_code=status.HTTP_202_ACCEPTED,
    summary=GENERATE_SUMMARY,
    description=GENERATE_DESCRIPTION,
    responses=GENERATE_RESPONSES,
)
def generate_architecture_decision(
    enqueue: EnqueueServiceDep,
    body: GenerateArchitectureDecisionRequestSchema = Body(...),
) -> JSONResponse:
    try:
        context = ProjectContext.model_validate(body.context.model_dump())
        recommendations = RecommendationsResponse.model_validate(
            body.recommendations.model_dump()
        )
    except ValidationError as error:
        raise BadRequestError("Invalid architecture decision request", error.errors()) from error

    logger.info(
        "Enqueueing architecture decision generation job",
        teamSize=context.teamSize,
        computeRecommendation=recommendations.compute.recommended,
    )
    job_id = enqueue.enqueue_generate_architecture_decision(context, recommendations)
    return JSONResponse(status_code=202, content=JobAcceptedSchema(jobId=job_id).model_dump())


@router.get(
    "",
    response_model=ArchitectureDecisionListResponseSchema,
    summary=LIST_SUMMARY,
    description=LIST_DESCRIPTION,
    responses=LIST_RESPONSES,
)
def list_architecture_decisions(
    repository: RepositoryDep,
    search: str | None = LIST_SEARCH_QUERY,
    status_filter: str | None = LIST_STATUS_QUERY,
) -> ArchitectureDecisionListResponseSchema:
    items = repository.list(
        ArchitectureDecisionListFilters(search=search, status=status_filter)
    )
    return ArchitectureDecisionListResponseSchema.model_validate(
        {"architectureDecisions": [item.model_dump() for item in items]}
    )


@router.get(
    "/{decision_id}",
    response_model=ArchitectureDecisionResponseSchema,
    summary=GET_SUMMARY,
    responses=GET_RESPONSES,
)
def get_architecture_decision(
    decision_id: str,
    repository: RepositoryDep,
) -> ArchitectureDecisionResponseSchema:
    architecture_decision = repository.find_by_id(decision_id)
    if architecture_decision is None:
        raise NotFoundError("Architecture decision not found")
    return ArchitectureDecisionResponseSchema.model_validate(
        {"architectureDecision": architecture_decision.model_dump()}
    )
