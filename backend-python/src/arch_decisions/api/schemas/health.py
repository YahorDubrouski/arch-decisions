from __future__ import annotations

from pydantic import BaseModel, Field


class HealthResponseSchema(BaseModel):
    status: str = Field(..., examples=["ok"])
    message: str
