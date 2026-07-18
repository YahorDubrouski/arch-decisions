from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings

from arch_decisions.core.config.settings_config import SETTINGS_CONFIG


class RedisSettings(BaseSettings):
    model_config = SETTINGS_CONFIG

    redis_url: str = "redis://localhost:6379/0"


@lru_cache
def get_redis_settings() -> RedisSettings:
    return RedisSettings()
