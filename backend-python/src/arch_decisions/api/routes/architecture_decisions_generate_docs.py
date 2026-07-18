from __future__ import annotations

from arch_decisions.api.schemas import ErrorResponseSchema, JobAcceptedSchema

GENERATE_SUMMARY = "Enqueue ADR generation"

GENERATE_DESCRIPTION = (
    "Validates context + recommendations and returns 202 with a jobId. "
    "Poll GET /api/jobs/{jobId} for the generated Architecture Decision Record."
)

GENERATE_RESPONSES = {
    202: {"description": "Job accepted", "model": JobAcceptedSchema},
    400: {"description": "Invalid request body", "model": ErrorResponseSchema},
}
