from __future__ import annotations

from fastapi import Body

from arch_decisions.api.schemas import (
    ErrorResponseSchema,
    EvaluateRecommendationsRequestSchema,
    JobAcceptedSchema,
    ProjectContextSchema,
)

EVALUATE_SUMMARY = "Enqueue recommendation evaluation"

EVALUATE_DESCRIPTION = (
    "Validates project context and returns 202 with a jobId. "
    "Poll GET /api/jobs/{jobId} for results. "
    'Body may be `{ "context": {…} }` or a bare project context object.'
)

EVALUATE_RESPONSES = {
    202: {"description": "Job accepted", "model": JobAcceptedSchema},
    400: {"description": "Invalid project context", "model": ErrorResponseSchema},
}

EVALUATE_BODY = Body(
    openapi_examples={
        "wrapped": {
            "summary": "Context wrapped in { context }",
            "value": {
                "context": {
                    "teamSize": "1-5",
                    "trafficPattern": "low-steady",
                    "budgetSensitivity": "cost-optimized",
                    "complianceRequirements": [],
                    "operationalMaturity": "minimal",
                }
            },
        },
        "bare": {
            "summary": "Bare project context",
            "value": {
                "teamSize": "1-5",
                "trafficPattern": "low-steady",
                "budgetSensitivity": "cost-optimized",
                "complianceRequirements": [],
                "operationalMaturity": "minimal",
            },
        },
    }
)

EvaluateBodyType = EvaluateRecommendationsRequestSchema | ProjectContextSchema
