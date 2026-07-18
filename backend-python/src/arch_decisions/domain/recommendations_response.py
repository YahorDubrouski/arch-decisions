from __future__ import annotations

from pydantic import BaseModel

from arch_decisions.domain.recommendation_category import RecommendationResult


class RecommendationsResponse(BaseModel):
    compute: RecommendationResult
    secrets: RecommendationResult
    cicd: RecommendationResult
