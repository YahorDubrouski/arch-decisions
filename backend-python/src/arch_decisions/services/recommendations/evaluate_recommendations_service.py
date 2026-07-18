from __future__ import annotations

from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.services.recommendations.recommendation_provider import RecommendationProvider


class EvaluateRecommendationsService:
    def __init__(self, recommendation_provider: RecommendationProvider) -> None:
        self._recommendation_provider = recommendation_provider

    async def evaluate_all(self, context: ProjectContext) -> RecommendationsResponse:
        return await self._recommendation_provider.evaluate_all(context)
