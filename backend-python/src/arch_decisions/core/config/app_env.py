from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings

from arch_decisions.core.config.settings_config import SETTINGS_CONFIG


class AppEnvSettings(BaseSettings):
    model_config = SETTINGS_CONFIG

    app_env: str = "development"
    port: int = 3000
    log_level: str = "info"


@lru_cache
def get_app_env_settings() -> AppEnvSettings:
    return AppEnvSettings()
