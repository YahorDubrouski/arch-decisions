"""HTTP integration — GET /api/jobs/{job_id}.

Business rules under test:
- A newly enqueued job can be polled by id.
- Unknown job ids are reported as not found.
"""

from __future__ import annotations

from fastapi.testclient import TestClient

from tests.fixtures.project_context import make_project_context


def test_when_client_polls_an_enqueued_job_then_return_job_status(
    client: TestClient,
) -> None:
    """
    Given
    - A recommendations evaluation job was accepted.
    When
    - A client polls that job id.
    Then
    - The API returns job status for that id.
    """
    # Arrange
    enqueue_response = client.post(
        "/api/recommendations/evaluate",
        json={"context": make_project_context().model_dump()},
    )
    assert enqueue_response.status_code == 202
    job_id = enqueue_response.json()["jobId"]

    # Act
    response = client.get(f"/api/jobs/{job_id}")

    # Assert
    assert response.status_code == 200
    job = response.json()["job"]
    assert job["jobId"] == job_id
    assert isinstance(job["status"], str)
    assert isinstance(job["type"], str)


def test_when_client_polls_an_unknown_job_then_respond_not_found(
    client: TestClient,
) -> None:
    """
    Given
    - The requested job id does not exist.
    When
    - A client polls that job.
    Then
    - The API responds with not found.
    """
    # Arrange
    unknown_job_id = "00000000-0000-4000-8000-000000000000"

    # Act
    response = client.get(f"/api/jobs/{unknown_job_id}")

    # Assert
    assert response.status_code == 404
    assert "error" in response.json()
