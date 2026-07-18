from __future__ import annotations

from typing import Protocol

from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse


class RecommendationProvider(Protocol):
    async def evaluate_all(self, context: ProjectContext) -> RecommendationsResponse: ...
