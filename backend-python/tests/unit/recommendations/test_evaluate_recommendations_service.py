"""Evaluate-recommendations service — mock provider rules.

Business rules under test:
- Small / cost-oriented default context maps to EC2, Parameter Store, and GitHub Actions.
"""

from __future__ import annotations

import pytest

from arch_decisions.infrastructure.openai.mock_recommendation_provider import (
    MockRecommendationProvider,
)
from arch_decisions.services.recommendations.evaluate_recommendations_service import (
    EvaluateRecommendationsService,
)
from tests.fixtures.project_context import make_project_context


@pytest.mark.asyncio
async def test_when_default_context_is_evaluated_then_return_mock_stack() -> None:
    """
    Given
    - Recommendations use the mock provider.
    - Project context is the default fixture (small, cost-optimized).
    When
    - Recommendations are evaluated.
    Then
    - Compute is EC2, secrets is Parameter Store, and CI/CD is GitHub Actions.
    """
    # Arrange
    service = EvaluateRecommendationsService(MockRecommendationProvider())
    context = make_project_context()

    # Act
    result = await service.evaluate_all(context)

    # Assert
    assert result.compute.recommended == "EC2"
    assert result.secrets.recommended == "AWS Parameter Store"
    assert result.cicd.recommended == "GitHub Actions"
