"""HTTP integration — POST /api/recommendations/evaluate."""

from __future__ import annotations

from fastapi.testclient import TestClient

from tests.fixtures.project_context import make_project_context


def test_when_evaluate_payload_is_valid_then_accept_job(client: TestClient) -> None:
    """
    Given
    - The evaluate payload has a valid project context.
    When
    - A client requests recommendation evaluation.
    Then
    - The API accepts the job and returns a jobId.
    """
    # Arrange
    payload = {"context": make_project_context().model_dump()}

    # Act
    response = client.post("/api/recommendations/evaluate", json=payload)

    # Assert
    assert response.status_code == 202
    assert isinstance(response.json()["jobId"], str)
    assert len(response.json()["jobId"]) > 0


def test_when_evaluate_payload_has_invalid_context_then_reject_as_bad_request(
    client: TestClient,
) -> None:
    """
    Given
    - The evaluate payload has an invalid project context.
    When
    - A client requests recommendation evaluation.
    Then
    - The API rejects the request as a bad request.
    """
    # Arrange
    invalid_payload = {"context": {"teamSize": "nope"}}

    # Act
    response = client.post("/api/recommendations/evaluate", json=invalid_payload)

    # Assert
    assert response.status_code == 400
    assert "error" in response.json()
