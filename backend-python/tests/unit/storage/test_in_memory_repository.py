"""In-memory architecture decision repository and seed behavior.

Business rules under test:
- Search filters the document list.
- Seeding inserts demo ADRs once and does not duplicate on repeat.
"""

from __future__ import annotations

from arch_decisions.domain.architecture_decision import (
    ARCHITECTURE_DECISION_STATUS,
    ArchitectureDecision,
    ArchitectureDecisionListFilters,
)
from arch_decisions.infrastructure.storage.in_memory_architecture_decision_repository import (
    InMemoryArchitectureDecisionRepository,
)
from arch_decisions.infrastructure.storage.seed.seed_architecture_decisions_if_empty import (
    seed_architecture_decisions_if_empty,
)


def test_when_list_is_filtered_by_search_then_return_matching_documents() -> None:
    """
    Given
    - Two saved ADRs (Alpha ECS and Beta EKS).
    When
    - The repository is listed with search "eks".
    Then
    - Only the EKS document is returned.
    """
    # Arrange
    repository = InMemoryArchitectureDecisionRepository()
    repository.save(
        ArchitectureDecision(
            id="a",
            title="Alpha ECS",
            status=ARCHITECTURE_DECISION_STATUS,
            content="c",
            summary="alpha summary",
            createdAt="2026-01-01T00:00:00.000Z",
        )
    )
    repository.save(
        ArchitectureDecision(
            id="b",
            title="Beta EKS",
            status=ARCHITECTURE_DECISION_STATUS,
            content="c",
            summary="beta summary",
            createdAt="2026-02-01T00:00:00.000Z",
        )
    )

    # Act
    items = repository.list(ArchitectureDecisionListFilters(search="eks"))

    # Assert
    assert len(items) == 1
    assert items[0].id == "b"


def test_when_seed_runs_twice_then_keep_the_same_document_count() -> None:
    """
    Given
    - An empty in-memory repository.
    When
    - Demo ADRs are seeded, then seeded again.
    Then
    - The first seed inserts many documents and the second seed adds none.
    """
    # Arrange
    repository = InMemoryArchitectureDecisionRepository()

    # Act
    seed_architecture_decisions_if_empty(repository)
    first_count = len(repository.list())
    seed_architecture_decisions_if_empty(repository)
    second_count = len(repository.list())

    # Assert
    assert first_count >= 15
    assert second_count == first_count
