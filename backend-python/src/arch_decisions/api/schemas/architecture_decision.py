from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from arch_decisions.api.schemas.project_context import ProjectContextSchema
from arch_decisions.api.schemas.recommendations import RecommendationsResponseSchema


class GenerateArchitectureDecisionRequestSchema(BaseModel):
    context: ProjectContextSchema
    recommendations: RecommendationsResponseSchema


class ArchitectureDecisionListItemSchema(BaseModel):
    id: str
    title: str
    status: Literal["proposed"] = Field(..., description="ADR lifecycle status.")
    summary: str = Field(..., description="Short executive summary.")
    createdAt: str = Field(..., description="ISO-8601 creation timestamp.")


class ArchitectureDecisionSchema(ArchitectureDecisionListItemSchema):
    content: str = Field(..., description="Full markdown Architecture Decision Record.")


class ArchitectureDecisionListResponseSchema(BaseModel):
    architectureDecisions: list[ArchitectureDecisionListItemSchema]


class ArchitectureDecisionResponseSchema(BaseModel):
    architectureDecision: ArchitectureDecisionSchema
