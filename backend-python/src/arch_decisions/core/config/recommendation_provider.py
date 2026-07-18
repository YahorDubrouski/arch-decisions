from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings

from arch_decisions.core.config.settings_config import SETTINGS_CONFIG

RecommendationProviderName = Literal["mock", "openai"]


class RecommendationProviderSettings(BaseSettings):
    model_config = SETTINGS_CONFIG

    recommendation_provider: RecommendationProviderName = "mock"


@lru_cache
def get_recommendation_provider_settings() -> RecommendationProviderSettings:
    return RecommendationProviderSettings()
