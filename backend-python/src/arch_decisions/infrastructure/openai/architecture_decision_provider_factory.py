from __future__ import annotations

from arch_decisions.core.config.architecture_decision_generator import (
    ArchitectureDecisionGeneratorSettings,
    get_architecture_decision_generator_settings,
)
from arch_decisions.core.config.openai import OpenAISettings, get_openai_settings
from arch_decisions.infrastructure.openai.openai_architecture_decision_provider import (
    create_openai_architecture_decision_provider,
)
from arch_decisions.infrastructure.openai.template_architecture_decision_provider import (
    create_template_architecture_decision_provider,
)
from arch_decisions.services.architecture_decisions.architecture_decision_generator import (
    ArchitectureDecisionGenerator,
)


def create_architecture_decision_generator(
    settings: ArchitectureDecisionGeneratorSettings | None = None,
    openai: OpenAISettings | None = None,
) -> ArchitectureDecisionGenerator:
    active = settings or get_architecture_decision_generator_settings()
    openai_settings = openai or get_openai_settings()
    if active.architecture_decision_generator_provider == "template":
        return create_template_architecture_decision_provider()
    if active.architecture_decision_generator_provider == "openai":
        if not openai_settings.openai_api_key:
            raise ValueError(
                "ARCHITECTURE_DECISION_GENERATOR_PROVIDER is openai but OPENAI_API_KEY is not set."
            )
        return create_openai_architecture_decision_provider()
    raise ValueError(
        "Unknown ARCHITECTURE_DECISION_GENERATOR_PROVIDER="
        f"{active.architecture_decision_generator_provider!r}. Expected 'template' or 'openai'."
    )
