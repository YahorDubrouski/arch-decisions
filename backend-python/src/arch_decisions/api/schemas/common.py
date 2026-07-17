from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class HealthResponseSchema(BaseModel):
    status: str = Field(..., examples=["ok"])
    message: str


class ErrorResponseSchema(BaseModel):
    error: str
    details: Any | None = None
    correlationId: str | None = Field(
        default=None,
        description="Request correlation id from x-request-id when available.",
    )
