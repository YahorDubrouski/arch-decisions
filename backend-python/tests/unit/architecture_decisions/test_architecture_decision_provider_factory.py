"""Architecture decision generator factory — provider selection.

Business rules under test:
- Template is the safe default generator.
- OpenAI without an API key fails loudly at startup/wiring time.
"""

from __future__ import annotations

import pytest

from arch_decisions.core.config.architecture_decision_generator import (
    ArchitectureDecisionGeneratorSettings,
)
from arch_decisions.core.config.openai import OpenAISettings
from arch_decisions.infrastructure.openai.architecture_decision_provider_factory import (
    create_architecture_decision_generator,
)
from arch_decisions.infrastructure.openai.template_architecture_decision_provider import (
    TemplateArchitectureDecisionProvider,
)


def test_when_generator_provider_is_template_then_return_template_implementation() -> None:
    """
    Given
    - Settings select the template architecture decision generator.
    When
    - The generator factory creates a provider.
    Then
    - A template provider is returned.
    """
    # Arrange
    settings = ArchitectureDecisionGeneratorSettings(
        architecture_decision_generator_provider="template",
    )

    # Act
    provider = create_architecture_decision_generator(settings)

    # Assert
    assert isinstance(provider, TemplateArchitectureDecisionProvider)


def test_when_openai_generator_has_no_api_key_then_fail_loud() -> None:
    """
    Given
    - Settings select OpenAI generation without an API key.
    When
    - The generator factory creates a provider.
    Then
    - Creation fails with an OPENAI_API_KEY error.
    """
    # Arrange
    settings = ArchitectureDecisionGeneratorSettings(
        architecture_decision_generator_provider="openai",
    )
    openai = OpenAISettings(openai_api_key="")

    # Act / Assert
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        create_architecture_decision_generator(settings, openai=openai)
