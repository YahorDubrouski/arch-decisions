"""Domain-split configuration (mirrors Express `backend/src/config/*`)."""

from arch_decisions.core.config.app_env import AppEnvSettings, get_app_env_settings
from arch_decisions.core.config.architecture_decision_generator import (
    ArchitectureDecisionGeneratorProviderName,
    ArchitectureDecisionGeneratorSettings,
    get_architecture_decision_generator_settings,
)
from arch_decisions.core.config.database import DatabaseSettings, get_database_settings
from arch_decisions.core.config.openai import OpenAISettings, get_openai_settings
from arch_decisions.core.config.recommendation_provider import (
    RecommendationProviderName,
    RecommendationProviderSettings,
    get_recommendation_provider_settings,
)
from arch_decisions.core.config.redis import RedisSettings, get_redis_settings
from arch_decisions.core.config.storage import (
    StorageProviderName,
    StorageSettings,
    get_storage_settings,
)


def clear_settings_caches() -> None:
    """Clear cached settings so tests can change env between cases."""
    get_app_env_settings.cache_clear()
    get_openai_settings.cache_clear()
    get_redis_settings.cache_clear()
    get_storage_settings.cache_clear()
    get_database_settings.cache_clear()
    get_recommendation_provider_settings.cache_clear()
    get_architecture_decision_generator_settings.cache_clear()


__all__ = [
    "AppEnvSettings",
    "ArchitectureDecisionGeneratorProviderName",
    "ArchitectureDecisionGeneratorSettings",
    "DatabaseSettings",
    "OpenAISettings",
    "RecommendationProviderName",
    "RecommendationProviderSettings",
    "RedisSettings",
    "StorageProviderName",
    "StorageSettings",
    "clear_settings_caches",
    "get_app_env_settings",
    "get_architecture_decision_generator_settings",
    "get_database_settings",
    "get_openai_settings",
    "get_recommendation_provider_settings",
    "get_redis_settings",
    "get_storage_settings",
]
