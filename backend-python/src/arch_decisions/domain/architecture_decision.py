from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

ARCHITECTURE_DECISION_STATUS: Literal["proposed"] = "proposed"


class ArchitectureDecision(BaseModel):
    id: str
    title: str
    status: Literal["proposed"]
    content: str
    summary: str
    createdAt: str


class ArchitectureDecisionListItem(BaseModel):
    id: str
    title: str
    status: Literal["proposed"]
    summary: str
    createdAt: str


class ArchitectureDecisionListFilters(BaseModel):
    search: str | None = None
    status: str | None = None


class ArchitectureDecisionDraft(BaseModel):
    title: str
    status: Literal["proposed"]
    content: str
    summary: str


def matches_architecture_decision_list_filters(
    item: ArchitectureDecisionListItem,
    filters: ArchitectureDecisionListFilters,
) -> bool:
    if filters.status and item.status != filters.status:
        return False

    normalized_search = filters.search.strip().lower() if filters.search else None
    if normalized_search:
        haystack = f"{item.title} {item.summary}".lower()
        if normalized_search not in haystack:
            return False

    return True
