from __future__ import annotations

from fastapi import APIRouter

from arch_decisions.api.routes.health_docs import (
    HEALTH_DESCRIPTION,
    HEALTH_RESPONSES,
    HEALTH_SUMMARY,
)
from arch_decisions.api.schemas import HealthResponseSchema

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponseSchema,
    summary=HEALTH_SUMMARY,
    description=HEALTH_DESCRIPTION,
    responses=HEALTH_RESPONSES,
)
def health() -> HealthResponseSchema:
    return HealthResponseSchema(
        status="ok",
        message="Architecture Decisions Python API is running",
    )
