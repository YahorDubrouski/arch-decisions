"""Generate-architecture-decision service — template provider persistence.

Business rules under test:
- Generating an ADR persists a proposed document the repository can load again.
"""

from __future__ import annotations

import pytest

from arch_decisions.infrastructure.openai.template_architecture_decision_provider import (
    TemplateArchitectureDecisionProvider,
)
from arch_decisions.infrastructure.storage.in_memory_architecture_decision_repository import (
    InMemoryArchitectureDecisionRepository,
)
from arch_decisions.services.architecture_decisions.generate_architecture_decision_service import (
    GenerateArchitectureDecisionService,
)
from tests.fixtures.project_context import make_project_context
from tests.fixtures.recommendations import make_recommendations_response


@pytest.mark.asyncio
async def test_when_adr_is_generated_then_persist_proposed_document() -> None:
    """
    Given
    - Template ADR generation and an empty in-memory repository.
    When
    - An architecture decision is generated for a valid context and recommendations.
    Then
    - The ADR is stored as proposed and contains Architecture Decision Record content.
    """
    # Arrange
    repository = InMemoryArchitectureDecisionRepository()
    service = GenerateArchitectureDecisionService(
        TemplateArchitectureDecisionProvider(),
        repository,
    )
    context = make_project_context()
    recommendations = make_recommendations_response()

    # Act
    decision = await service.generate(context, recommendations)

    # Assert
    assert repository.find_by_id(decision.id) is not None
    assert "Architecture Decision Record" in decision.content
    assert decision.status == "proposed"
