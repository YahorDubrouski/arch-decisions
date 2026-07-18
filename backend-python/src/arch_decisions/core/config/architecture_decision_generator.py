from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings

from arch_decisions.core.config.settings_config import SETTINGS_CONFIG

ArchitectureDecisionGeneratorProviderName = Literal["template", "openai"]


class ArchitectureDecisionGeneratorSettings(BaseSettings):
    model_config = SETTINGS_CONFIG

    architecture_decision_generator_provider: ArchitectureDecisionGeneratorProviderName = (
        "template"
    )


@lru_cache
def get_architecture_decision_generator_settings() -> ArchitectureDecisionGeneratorSettings:
    return ArchitectureDecisionGeneratorSettings()
