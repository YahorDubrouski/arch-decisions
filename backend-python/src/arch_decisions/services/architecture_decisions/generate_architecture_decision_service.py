from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from arch_decisions.domain.architecture_decision import ArchitectureDecision
from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.infrastructure.storage.architecture_decision_repository import (
    ArchitectureDecisionRepository,
)
from arch_decisions.services.architecture_decisions.architecture_decision_generator import (
    ArchitectureDecisionGenerator,
)


class GenerateArchitectureDecisionService:
    def __init__(
        self,
        architecture_decision_generator: ArchitectureDecisionGenerator,
        architecture_decision_repository: ArchitectureDecisionRepository,
    ) -> None:
        self._generator = architecture_decision_generator
        self._repository = architecture_decision_repository

    async def generate(
        self,
        context: ProjectContext,
        recommendations: RecommendationsResponse,
    ) -> ArchitectureDecision:
        draft = await self._generator.generate(context, recommendations)
        architecture_decision = ArchitectureDecision(
            id=str(uuid4()),
            title=draft.title,
            status=draft.status,
            content=draft.content,
            summary=draft.summary,
            createdAt=datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        )
        self._repository.save(architecture_decision)
        return architecture_decision
