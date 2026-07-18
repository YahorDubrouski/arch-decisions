from __future__ import annotations

from pydantic_settings import SettingsConfigDict

# Shared by every domain settings model so .env loading stays consistent.
SETTINGS_CONFIG = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
    extra="ignore",
)
