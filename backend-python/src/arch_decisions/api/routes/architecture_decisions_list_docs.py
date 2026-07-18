from __future__ import annotations

from fastapi import Query

LIST_SUMMARY = "List architecture decisions"

LIST_DESCRIPTION = "Returns saved ADRs, optionally filtered by search text and status."

LIST_RESPONSES = {200: {"description": "List of architecture decisions"}}

LIST_SEARCH_QUERY = Query(default=None, description="Case-insensitive title/summary match.")

LIST_STATUS_QUERY = Query(
    default=None,
    alias="status",
    description="Filter by ADR status (e.g. proposed).",
)
