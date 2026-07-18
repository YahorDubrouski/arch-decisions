from __future__ import annotations

from fastapi import Path

from arch_decisions.api.schemas import ErrorResponseSchema

GET_JOB_SUMMARY = "Get job status"

GET_JOB_DESCRIPTION = "Poll until status is completed or failed. Result appears when completed."

GET_JOB_RESPONSES = {
    200: {"description": "Job status snapshot"},
    404: {"description": "Job not found", "model": ErrorResponseSchema},
}

GET_JOB_ID_PATH = Path(..., description="Job id returned from a 202 enqueue response.")
