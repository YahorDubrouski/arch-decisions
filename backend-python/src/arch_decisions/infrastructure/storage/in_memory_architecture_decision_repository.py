from __future__ import annotations

from arch_decisions.domain.architecture_decision import (
    ArchitectureDecision,
    ArchitectureDecisionListFilters,
    ArchitectureDecisionListItem,
    matches_architecture_decision_list_filters,
)
from arch_decisions.infrastructure.storage.architecture_decision_repository import (
    ArchitectureDecisionRepository,
)


class InMemoryArchitectureDecisionRepository:
    def __init__(self) -> None:
        self._records: dict[str, ArchitectureDecision] = {}

    def save(self, architecture_decision: ArchitectureDecision) -> None:
        self._records[architecture_decision.id] = architecture_decision

    def find_by_id(self, decision_id: str) -> ArchitectureDecision | None:
        return self._records.get(decision_id)

    def list(
        self, filters: ArchitectureDecisionListFilters | None = None
    ) -> list[ArchitectureDecisionListItem]:
        active_filters = filters or ArchitectureDecisionListFilters()
        items = [
            ArchitectureDecisionListItem(
                id=decision.id,
                title=decision.title,
                status=decision.status,
                summary=decision.summary,
                createdAt=decision.createdAt,
            )
            for decision in self._records.values()
        ]
        return sorted(
            [
                item
                for item in items
                if matches_architecture_decision_list_filters(item, active_filters)
            ],
            key=lambda item: item.createdAt,
            reverse=True,
        )


def create_in_memory_repository() -> ArchitectureDecisionRepository:
    return InMemoryArchitectureDecisionRepository()
