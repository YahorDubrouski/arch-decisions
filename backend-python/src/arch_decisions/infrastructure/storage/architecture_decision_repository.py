from __future__ import annotations

from typing import Protocol

from arch_decisions.domain.architecture_decision import (
    ArchitectureDecision,
    ArchitectureDecisionListFilters,
    ArchitectureDecisionListItem,
)


class ArchitectureDecisionRepository(Protocol):
    def save(self, architecture_decision: ArchitectureDecision) -> None: ...

    def find_by_id(self, decision_id: str) -> ArchitectureDecision | None: ...

    def list(
        self, filters: ArchitectureDecisionListFilters | None = None
    ) -> list[ArchitectureDecisionListItem]: ...
