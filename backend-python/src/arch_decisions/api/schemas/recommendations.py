from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from arch_decisions.api.schemas.project_context import ProjectContextSchema

TradeOffLevel = Literal["low", "medium", "high"]


class TradeOffsSchema(BaseModel):
    cost: TradeOffLevel = Field(..., description="Relative cost of the recommended option.")
    complexity: TradeOffLevel = Field(..., description="Implementation complexity.")
    risk: TradeOffLevel = Field(..., description="Operational / delivery risk.")
    operationalOverhead: TradeOffLevel = Field(
        ...,
        description="Ongoing ops burden after go-live.",
    )


class RecommendationResultSchema(BaseModel):
    category: Literal["compute", "secrets", "cicd"] = Field(
        ...,
        description="Recommendation category.",
    )
    recommended: str = Field(..., description="Primary recommended option.", examples=["EC2"])
    alternatives: list[str] = Field(
        ...,
        description="Alternative options considered.",
        min_length=1,
        examples=[["ECS", "Lambda"]],
    )
    tradeOffs: TradeOffsSchema


class RecommendationsResponseSchema(BaseModel):
    compute: RecommendationResultSchema
    secrets: RecommendationResultSchema
    cicd: RecommendationResultSchema


class EvaluateRecommendationsRequestSchema(BaseModel):
    context: ProjectContextSchema = Field(
        ...,
        description="Project context used to evaluate infrastructure recommendations.",
    )
