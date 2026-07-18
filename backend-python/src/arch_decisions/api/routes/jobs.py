from __future__ import annotations

from fastapi import APIRouter

from arch_decisions.api.deps import GetJobServiceDep
from arch_decisions.api.routes.jobs_get_docs import (
    GET_JOB_DESCRIPTION,
    GET_JOB_ID_PATH,
    GET_JOB_RESPONSES,
    GET_JOB_SUMMARY,
)
from arch_decisions.api.schemas import JobStatusResponseSchema

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get(
    "/{job_id}",
    response_model=JobStatusResponseSchema,
    summary=GET_JOB_SUMMARY,
    description=GET_JOB_DESCRIPTION,
    responses=GET_JOB_RESPONSES,
)
def get_job(
    get_job_service: GetJobServiceDep,
    job_id: str = GET_JOB_ID_PATH,
) -> JobStatusResponseSchema:
    job = get_job_service.get_by_id(job_id)
    return JobStatusResponseSchema.model_validate({"job": job.model_dump(exclude_none=True)})
