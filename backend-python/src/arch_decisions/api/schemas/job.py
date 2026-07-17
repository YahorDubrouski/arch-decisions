from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

JobStatus = Literal["waiting", "active", "completed", "failed", "delayed", "unknown"]


class JobAcceptedSchema(BaseModel):
    jobId: str = Field(
        ...,
        description="Poll GET /api/jobs/{jobId} until status is completed or failed.",
        examples=["2fa0a036-613d-4ed9-8d84-cf96352cb68b"],
    )


class ArchitectureJobStatusViewSchema(BaseModel):
    jobId: str
    type: str = Field(..., description="Job type name, e.g. evaluate-recommendations.")
    status: JobStatus
    result: Any | None = Field(default=None, description="Present when status is completed.")
    error: str | None = Field(default=None, description="Present when status is failed.")


class JobStatusResponseSchema(BaseModel):
    job: ArchitectureJobStatusViewSchema
