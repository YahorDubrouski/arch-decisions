from __future__ import annotations

from arch_decisions.core.logging import get_logger
from arch_decisions.infrastructure.storage.architecture_decision_repository import (
    ArchitectureDecisionRepository,
)
from arch_decisions.infrastructure.storage.seed.architecture_decision_seeds import (
    ARCHITECTURE_DECISION_SEEDS,
)

logger = get_logger(__name__)


def seed_architecture_decisions_if_empty(
    architecture_decision_repository: ArchitectureDecisionRepository,
) -> None:
    """Insert missing seed ids only — never overwrite existing documents."""
    inserted_ids: list[str] = []
    for seed in ARCHITECTURE_DECISION_SEEDS:
        if architecture_decision_repository.find_by_id(seed.id) is None:
            architecture_decision_repository.save(seed)
            inserted_ids.append(seed.id)

    if inserted_ids:
        logger.info(
            "Seeded demo architecture decisions",
            count=len(inserted_ids),
            ids=inserted_ids,
        )
