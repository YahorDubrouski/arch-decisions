from __future__ import annotations

from dataclasses import dataclass

from arch_decisions.core.config.app_env import get_app_env_settings
from arch_decisions.core.logging import configure_logging
from arch_decisions.infrastructure.openai.architecture_decision_provider_factory import (
    create_architecture_decision_generator,
)
from arch_decisions.infrastructure.openai.recommendation_provider_factory import (
    create_recommendation_provider,
)
from arch_decisions.infrastructure.storage.architecture_decision_repository import (
    ArchitectureDecisionRepository,
)
from arch_decisions.infrastructure.storage.architecture_decision_repository_factory import (
    create_architecture_decision_repository,
)
from arch_decisions.infrastructure.storage.seed.seed_architecture_decisions_if_empty import (
    seed_architecture_decisions_if_empty,
)
from arch_decisions.services.architecture_decisions.generate_architecture_decision_service import (
    GenerateArchitectureDecisionService,
)
from arch_decisions.services.jobs.enqueue_architecture_job_service import (
    EnqueueArchitectureJobService,
)
from arch_decisions.services.jobs.get_architecture_job_service import GetArchitectureJobService
from arch_decisions.services.recommendations.evaluate_recommendations_service import (
    EvaluateRecommendationsService,
)


@dataclass
class AppContainer:
    architecture_decision_repository: ArchitectureDecisionRepository
    evaluate_recommendations_service: EvaluateRecommendationsService
    generate_architecture_decision_service: GenerateArchitectureDecisionService
    enqueue_architecture_job_service: EnqueueArchitectureJobService
    get_architecture_job_service: GetArchitectureJobService


_container: AppContainer | None = None


def build_container(*, seed: bool = True) -> AppContainer:
    configure_logging(get_app_env_settings().log_level)

    repository = create_architecture_decision_repository()
    if seed:
        seed_architecture_decisions_if_empty(repository)

    recommendation_provider = create_recommendation_provider()
    architecture_decision_generator = create_architecture_decision_generator()

    return AppContainer(
        architecture_decision_repository=repository,
        evaluate_recommendations_service=EvaluateRecommendationsService(recommendation_provider),
        generate_architecture_decision_service=GenerateArchitectureDecisionService(
            architecture_decision_generator,
            repository,
        ),
        enqueue_architecture_job_service=EnqueueArchitectureJobService(),
        get_architecture_job_service=GetArchitectureJobService(),
    )


def get_container() -> AppContainer:
    global _container
    if _container is None:
        _container = build_container()
    return _container


def build_worker_container() -> AppContainer:
    # Worker skips re-seeding on every task; seed runs on API boot.
    return build_container(seed=False)


def reset_container() -> None:
    global _container
    _container = None
