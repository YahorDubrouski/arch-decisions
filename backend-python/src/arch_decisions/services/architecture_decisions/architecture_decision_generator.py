from __future__ import annotations

from typing import Protocol

from arch_decisions.domain.architecture_decision import ArchitectureDecisionDraft
from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse


class ArchitectureDecisionGenerator(Protocol):
    async def generate(
        self,
        context: ProjectContext,
        recommendations: RecommendationsResponse,
    ) -> ArchitectureDecisionDraft: ...
