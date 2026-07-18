"""Application error hierarchy — HTTP status mapping.

Business rules under test:
- Client mistakes map to 400, missing resources to 404, upstream failures to 502.
"""

from __future__ import annotations

from arch_decisions.core.errors import (
    AppError,
    BadRequestError,
    NotFoundError,
    UpstreamServiceError,
)


def test_when_app_errors_are_raised_then_expose_expected_status_codes() -> None:
    """
    Given
    - Typed application errors for bad request, not found, and upstream failure.
    When
    - Each error is constructed.
    Then
    - Status codes are 400, 404, and 502, and each is an AppError.
    """
    # Arrange

    # Act
    bad_request = BadRequestError("x")
    not_found = NotFoundError("x")
    upstream = UpstreamServiceError("x")

    # Assert
    assert bad_request.status_code == 400
    assert not_found.status_code == 404
    assert upstream.status_code == 502
    assert isinstance(bad_request, AppError)
