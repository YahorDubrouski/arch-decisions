"""HTTP integration — GET /openapi.json.

Business rules under test:
- OpenAPI documents the public HTTP contract clients rely on.
"""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_when_client_fetches_openapi_then_return_generated_api_contract(
    client: TestClient,
) -> None:
    """
    Given
    - OpenAPI is generated from FastAPI routes and Pydantic schemas.
    When
    - A client fetches the OpenAPI document.
    Then
    - The document names the API and lists the public routes.
    """
    # Arrange

    # Act
    response = client.get("/openapi.json")

    # Assert
    assert response.status_code == 200
    body = response.json()
    assert body["info"]["title"] == "Architecture Decisions API"
    paths = body["paths"]
    assert "/health" in paths
    assert "/api/recommendations/evaluate" in paths
    assert "/api/architecture-decisions" in paths
    assert "/api/architecture-decisions/generate" in paths
    assert "/api/architecture-decisions/{decision_id}" in paths
    assert "/api/jobs/{job_id}" in paths
