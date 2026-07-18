from __future__ import annotations

import os

from arch_decisions.core.config.architecture_decision_generator import (
    ArchitectureDecisionGeneratorSettings,
)
from arch_decisions.core.config.openai import OpenAISettings
from arch_decisions.core.config.recommendation_provider import RecommendationProviderSettings
from arch_decisions.core.config.storage import StorageSettings
from arch_decisions.infrastructure.openai.architecture_decision_provider_factory import (
    create_architecture_decision_generator,
)
from arch_decisions.infrastructure.openai.mock_recommendation_provider import (
    MockRecommendationProvider,
)
from arch_decisions.infrastructure.openai.recommendation_provider_factory import (
    create_recommendation_provider,
)
from arch_decisions.infrastructure.openai.template_architecture_decision_provider import (
    TemplateArchitectureDecisionProvider,
)
from arch_decisions.infrastructure.storage.architecture_decision_repository_factory import (
    create_architecture_decision_repository,
)
from arch_decisions.infrastructure.storage.in_memory_architecture_decision_repository import (
    InMemoryArchitectureDecisionRepository,
)


def main() -> None:
    print("Verifying provider matrix (Python)...")

    storage = StorageSettings(storage_provider="memory")
    recommendations = RecommendationProviderSettings(recommendation_provider="mock")
    generator = ArchitectureDecisionGeneratorSettings(
        architecture_decision_generator_provider="template",
    )

    repo = create_architecture_decision_repository(storage)
    assert isinstance(repo, InMemoryArchitectureDecisionRepository)
    print("  [ok] storage=memory → InMemoryArchitectureDecisionRepository")

    rec = create_recommendation_provider(recommendations)
    assert isinstance(rec, MockRecommendationProvider)
    print("  [ok] recommendation=mock → MockRecommendationProvider")

    gen = create_architecture_decision_generator(generator)
    assert isinstance(gen, TemplateArchitectureDecisionProvider)
    print("  [ok] generator=template → TemplateArchitectureDecisionProvider")

    try:
        create_recommendation_provider(
            RecommendationProviderSettings(recommendation_provider="openai"),
            openai=OpenAISettings(openai_api_key=""),
        )
        raise SystemExit("expected openai recommendation provider to fail without key")
    except ValueError as error:
        print(f"  [ok] recommendation=openai without key fails loud: {error}")

    try:
        create_architecture_decision_generator(
            ArchitectureDecisionGeneratorSettings(
                architecture_decision_generator_provider="openai",
            ),
            openai=OpenAISettings(openai_api_key=""),
        )
        raise SystemExit("expected openai ADR generator to fail without key")
    except ValueError as error:
        print(f"  [ok] generator=openai without key fails loud: {error}")

    if os.getenv("OPENAI_API_KEY"):
        openai = OpenAISettings(openai_api_key=os.environ["OPENAI_API_KEY"])
        create_recommendation_provider(
            RecommendationProviderSettings(recommendation_provider="openai"),
            openai=openai,
        )
        create_architecture_decision_generator(
            ArchitectureDecisionGeneratorSettings(
                architecture_decision_generator_provider="openai",
            ),
            openai=openai,
        )
        print("  [ok] openai providers construct when OPENAI_API_KEY is set")
    else:
        print("  [skip] live openai providers (OPENAI_API_KEY not set)")

    print("Provider matrix verification passed.")


if __name__ == "__main__":
    main()
