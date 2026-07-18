"""HTTP integration — POST /api/architecture-decisions/generate."""

from __future__ import annotations

from fastapi.testclient import TestClient

from tests.fixtures.project_context import make_project_context
from tests.fixtures.recommendations import make_recommendations_response


def test_when_generate_payload_is_valid_then_accept_job(client: TestClient) -> None:
    """
    Given
    - The generate payload has valid context and recommendations.
    When
    - A client requests ADR generation.
    Then
    - The API accepts the job and returns a jobId.
    """
    # Arrange
    payload = {
        "context": make_project_context().model_dump(),
        "recommendations": make_recommendations_response().model_dump(),
    }

    # Act
    response = client.post("/api/architecture-decisions/generate", json=payload)

    # Assert
    assert response.status_code == 202
    assert isinstance(response.json()["jobId"], str)
    assert len(response.json()["jobId"]) > 0


def test_when_generate_payload_is_invalid_then_reject_as_bad_request(
    client: TestClient,
) -> None:
    """
    Given
    - The generate payload is missing required fields.
    When
    - A client requests ADR generation.
    Then
    - The API rejects the request as a bad request.
    """
    # Arrange
    invalid_payload = {"context": make_project_context().model_dump()}

    # Act
    response = client.post("/api/architecture-decisions/generate", json=invalid_payload)

    # Assert
    assert response.status_code == 400
    assert "error" in response.json()
