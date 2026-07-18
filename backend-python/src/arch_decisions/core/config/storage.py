from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings

from arch_decisions.core.config.settings_config import SETTINGS_CONFIG

StorageProviderName = Literal["postgres", "memory"]


class StorageSettings(BaseSettings):
    model_config = SETTINGS_CONFIG

    storage_provider: StorageProviderName = "postgres"


@lru_cache
def get_storage_settings() -> StorageSettings:
    return StorageSettings()
