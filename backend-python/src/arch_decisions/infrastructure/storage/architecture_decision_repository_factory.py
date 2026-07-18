from __future__ import annotations

from arch_decisions.core.config.storage import StorageSettings, get_storage_settings
from arch_decisions.infrastructure.storage.architecture_decision_repository import (
    ArchitectureDecisionRepository,
)
from arch_decisions.infrastructure.storage.in_memory_architecture_decision_repository import (
    create_in_memory_repository,
)
from arch_decisions.infrastructure.storage.postgres_architecture_decision_repository import (
    create_postgres_repository,
)


def create_architecture_decision_repository(
    settings: StorageSettings | None = None,
) -> ArchitectureDecisionRepository:
    active = settings or get_storage_settings()
    if active.storage_provider == "memory":
        return create_in_memory_repository()
    if active.storage_provider == "postgres":
        return create_postgres_repository()
    raise ValueError(
        f"Unknown STORAGE_PROVIDER={active.storage_provider!r}. Expected 'postgres' or 'memory'."
    )
