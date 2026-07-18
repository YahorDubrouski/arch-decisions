from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings

from arch_decisions.core.config.settings_config import SETTINGS_CONFIG


class DatabaseSettings(BaseSettings):
    model_config = SETTINGS_CONFIG

    database_url: str = "postgresql+psycopg://arch:arch@localhost:5432/arch_decisions"


@lru_cache
def get_database_settings() -> DatabaseSettings:
    return DatabaseSettings()
