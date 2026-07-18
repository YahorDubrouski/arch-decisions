from __future__ import annotations

from arch_decisions.core.config.openai import OpenAISettings, get_openai_settings
from arch_decisions.core.config.recommendation_provider import (
    RecommendationProviderSettings,
    get_recommendation_provider_settings,
)
from arch_decisions.infrastructure.openai.mock_recommendation_provider import (
    create_mock_recommendation_provider,
)
from arch_decisions.infrastructure.openai.openai_recommendations_provider import (
    create_openai_recommendations_provider,
)
from arch_decisions.services.recommendations.recommendation_provider import RecommendationProvider


def create_recommendation_provider(
    settings: RecommendationProviderSettings | None = None,
    openai: OpenAISettings | None = None,
) -> RecommendationProvider:
    active = settings or get_recommendation_provider_settings()
    openai_settings = openai or get_openai_settings()
    if active.recommendation_provider == "mock":
        return create_mock_recommendation_provider()
    if active.recommendation_provider == "openai":
        if not openai_settings.openai_api_key:
            raise ValueError("RECOMMENDATION_PROVIDER is openai but OPENAI_API_KEY is not set.")
        return create_openai_recommendations_provider()
    raise ValueError(
        f"Unknown RECOMMENDATION_PROVIDER={active.recommendation_provider!r}. Expected 'mock' or 'openai'."
    )
