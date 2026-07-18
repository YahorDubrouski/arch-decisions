from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings

from arch_decisions.core.config.settings_config import SETTINGS_CONFIG


class OpenAISettings(BaseSettings):
    model_config = SETTINGS_CONFIG

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_timeout_ms: int = 30_000
    openai_max_retries: int = 2


@lru_cache
def get_openai_settings() -> OpenAISettings:
    return OpenAISettings()
