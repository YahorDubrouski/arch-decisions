"""HTTP integration — GET /api/architecture-decisions."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_when_client_lists_architecture_decisions_then_return_seeded_documents(
    client: TestClient,
) -> None:
    """
    Given
    - Demo architecture decisions have been seeded.
    When
    - A client lists architecture decisions.
    Then
    - At least fifteen decisions are returned for the documents grid.
    """
    # Arrange

    # Act
    response = client.get("/api/architecture-decisions")

    # Assert
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["architectureDecisions"], list)
    assert len(body["architectureDecisions"]) >= 15


def test_when_client_lists_with_matching_search_then_return_filtered_documents(
    client: TestClient,
) -> None:
    """
    Given
    - Demo architecture decisions have been seeded.
    When
    - A client lists with a search term that matches a known seed title.
    Then
    - Only matching decisions are returned.
    """
    # Arrange
    search = "Startup cost-optimized"

    # Act
    response = client.get("/api/architecture-decisions", params={"search": search})

    # Assert
    assert response.status_code == 200
    decisions = response.json()["architectureDecisions"]
    assert len(decisions) >= 1
    needle = search.lower()
    assert all(
        needle in item["title"].lower() or needle in item["summary"].lower()
        for item in decisions
    )
