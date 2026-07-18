"""HTTP integration — GET /health.

Business rules under test:
- The API exposes a health check for liveness.
"""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_when_client_checks_health_then_report_status_ok(client: TestClient) -> None:
    """
    Given
    - The API is running.
    When
    - A client checks service health.
    Then
    - The API reports status ok with a service message.
    """
    # Arrange

    # Act
    response = client.get("/health")

    # Assert
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert isinstance(body["message"], str)
    assert len(body["message"]) > 0
