from __future__ import annotations

from typing import Any, Literal

from celery.result import AsyncResult
from pydantic import BaseModel

from arch_decisions.celery_app import celery_app
from arch_decisions.core.errors import NotFoundError
from arch_decisions.infrastructure.queue.job_registry import get_registered_job_type

ArchitectureJobStatus = Literal["waiting", "active", "completed", "failed", "delayed", "unknown"]


class ArchitectureJobStatusView(BaseModel):
    jobId: str
    type: str
    status: ArchitectureJobStatus
    result: Any | None = None
    error: str | None = None


# Celery states collapse to the same polling vocabulary as the Express/BullMQ API.
# Example: PENDING → waiting; STARTED → active; SUCCESS → completed.
def map_celery_state(state: str) -> ArchitectureJobStatus:
    mapping: dict[str, ArchitectureJobStatus] = {
        "PENDING": "waiting",
        "RECEIVED": "waiting",
        "STARTED": "active",
        "SUCCESS": "completed",
        "FAILURE": "failed",
        "RETRY": "delayed",
        "REVOKED": "failed",
    }
    return mapping.get(state, "unknown")


class GetArchitectureJobService:
    def get_by_id(self, job_id: str) -> ArchitectureJobStatusView:
        registered_type = get_registered_job_type(job_id)
        result = AsyncResult(job_id, app=celery_app)

        if registered_type is None and result.state == "PENDING":
            raise NotFoundError("Job not found")

        status = map_celery_state(result.state)
        task_name = registered_type or result.name or "unknown"

        error: str | None = None
        payload: Any | None = None
        if status == "completed":
            payload = result.result
        elif status == "failed":
            error = str(result.result) if result.result is not None else "Job failed"

        return ArchitectureJobStatusView(
            jobId=job_id,
            type=str(task_name),
            status=status,
            result=payload,
            error=error,
        )
