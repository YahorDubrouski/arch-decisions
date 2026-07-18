from __future__ import annotations

from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from arch_decisions.core.config.database import DatabaseSettings, get_database_settings
from arch_decisions.domain.architecture_decision import (
    ArchitectureDecision,
    ArchitectureDecisionListFilters,
    ArchitectureDecisionListItem,
    matches_architecture_decision_list_filters,
)
from arch_decisions.infrastructure.db.models import ArchitectureDecisionModel
from arch_decisions.infrastructure.storage.architecture_decision_repository import (
    ArchitectureDecisionRepository,
)

_engine = None
_session_factory: sessionmaker[Session] | None = None


def configure_database(settings: DatabaseSettings | None = None) -> None:
    global _engine, _session_factory
    active = settings or get_database_settings()
    _engine = create_engine(active.database_url, pool_pre_ping=True)
    _session_factory = sessionmaker(bind=_engine, autoflush=False, autocommit=False)


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    if _session_factory is None:
        configure_database()
    assert _session_factory is not None
    session = _session_factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_session_factory() -> sessionmaker[Session]:
    if _session_factory is None:
        configure_database()
    assert _session_factory is not None
    return _session_factory


class PostgresArchitectureDecisionRepository:
    def save(self, architecture_decision: ArchitectureDecision) -> None:
        with session_scope() as session:
            session.merge(
                ArchitectureDecisionModel(
                    id=architecture_decision.id,
                    title=architecture_decision.title,
                    status=architecture_decision.status,
                    content=architecture_decision.content,
                    summary=architecture_decision.summary,
                    created_at=architecture_decision.createdAt,
                )
            )

    def find_by_id(self, decision_id: str) -> ArchitectureDecision | None:
        with session_scope() as session:
            row = session.get(ArchitectureDecisionModel, decision_id)
            if row is None:
                return None
            return _to_domain(row)

    def list(
        self, filters: ArchitectureDecisionListFilters | None = None
    ) -> list[ArchitectureDecisionListItem]:
        active_filters = filters or ArchitectureDecisionListFilters()
        with session_scope() as session:
            rows = session.scalars(
                select(ArchitectureDecisionModel).order_by(ArchitectureDecisionModel.created_at.desc())
            ).all()
            items = [_to_list_item(row) for row in rows]
            return [
                item
                for item in items
                if matches_architecture_decision_list_filters(item, active_filters)
            ]


def _to_domain(row: ArchitectureDecisionModel) -> ArchitectureDecision:
    return ArchitectureDecision(
        id=row.id,
        title=row.title,
        status=row.status,  # type: ignore[arg-type]
        content=row.content,
        summary=row.summary,
        createdAt=row.created_at,
    )


def _to_list_item(row: ArchitectureDecisionModel) -> ArchitectureDecisionListItem:
    return ArchitectureDecisionListItem(
        id=row.id,
        title=row.title,
        status=row.status,  # type: ignore[arg-type]
        summary=row.summary,
        createdAt=row.created_at,
    )


def create_postgres_repository() -> ArchitectureDecisionRepository:
    configure_database()
    return PostgresArchitectureDecisionRepository()
