from __future__ import annotations

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, Request

from arch_decisions.container import AppContainer, get_container
from arch_decisions.infrastructure.storage.architecture_decision_repository import (
    ArchitectureDecisionRepository,
)
from arch_decisions.services.jobs.enqueue_architecture_job_service import (
    EnqueueArchitectureJobService,
)
from arch_decisions.services.jobs.get_architecture_job_service import GetArchitectureJobService


def provide_container() -> Generator[AppContainer, None, None]:
    yield get_container()


ContainerDep = Annotated[AppContainer, Depends(provide_container)]


def provide_enqueue_service(container: ContainerDep) -> EnqueueArchitectureJobService:
    return container.enqueue_architecture_job_service


def provide_get_job_service(container: ContainerDep) -> GetArchitectureJobService:
    return container.get_architecture_job_service


def provide_repository(container: ContainerDep) -> ArchitectureDecisionRepository:
    return container.architecture_decision_repository


EnqueueServiceDep = Annotated[EnqueueArchitectureJobService, Depends(provide_enqueue_service)]
GetJobServiceDep = Annotated[GetArchitectureJobService, Depends(provide_get_job_service)]
RepositoryDep = Annotated[ArchitectureDecisionRepository, Depends(provide_repository)]


def correlation_id(request: Request) -> str | None:
    return getattr(request.state, "correlation_id", None)
