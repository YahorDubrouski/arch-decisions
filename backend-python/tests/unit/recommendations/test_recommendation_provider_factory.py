"""Recommendation provider factory — provider selection.

Business rules under test:
- Mock is the safe default recommendation provider.
- OpenAI without an API key fails loudly at startup/wiring time.
"""

from __future__ import annotations

import pytest

from arch_decisions.core.config.openai import OpenAISettings
from arch_decisions.core.config.recommendation_provider import RecommendationProviderSettings
from arch_decisions.infrastructure.openai.mock_recommendation_provider import (
    MockRecommendationProvider,
)
from arch_decisions.infrastructure.openai.recommendation_provider_factory import (
    create_recommendation_provider,
)


def test_when_recommendation_provider_is_mock_then_return_mock_implementation() -> None:
    """
    Given
    - Settings select the mock recommendation provider.
    When
    - The recommendation factory creates a provider.
    Then
    - A mock provider is returned.
    """
    # Arrange
    settings = RecommendationProviderSettings(recommendation_provider="mock")

    # Act
    provider = create_recommendation_provider(settings)

    # Assert
    assert isinstance(provider, MockRecommendationProvider)


def test_when_openai_recommendations_have_no_api_key_then_fail_loud() -> None:
    """
    Given
    - Settings select OpenAI recommendations without an API key.
    When
    - The recommendation factory creates a provider.
    Then
    - Creation fails with an OPENAI_API_KEY error.
    """
    # Arrange
    settings = RecommendationProviderSettings(recommendation_provider="openai")
    openai = OpenAISettings(openai_api_key="")

    # Act / Assert
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        create_recommendation_provider(settings, openai=openai)
