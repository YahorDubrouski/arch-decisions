"""HTTP integration — GET /api/architecture-decisions/{decision_id}.

Business rules under test:
- Demo architecture decisions are available to open by id.
- Unknown decision ids are reported as not found.
"""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_when_client_opens_a_known_seed_decision_then_return_the_proposed_adr(
    client: TestClient,
) -> None:
    """
    Given
    - A known seed decision id exists (startup cost-optimized).
    When
    - A client opens that architecture decision.
    Then
    - The proposed ADR document content is returned.
    """
    # Arrange
    decision_id = "seed-startup-cost-optimized"

    # Act
    response = client.get(f"/api/architecture-decisions/{decision_id}")

    # Assert
    assert response.status_code == 200
    decision = response.json()["architectureDecision"]
    assert decision["id"] == decision_id
    assert decision["status"] == "proposed"
    assert "Architecture Decision Record" in decision["content"]


def test_when_client_opens_an_unknown_decision_then_respond_not_found(
    client: TestClient,
) -> None:
    """
    Given
    - The requested architecture decision id does not exist.
    When
    - A client opens that architecture decision.
    Then
    - The API responds with not found.
    """
    # Arrange
    unknown_decision_id = "does-not-exist"

    # Act
    response = client.get(f"/api/architecture-decisions/{unknown_decision_id}")

    # Assert
    assert response.status_code == 404
    assert "error" in response.json()
