"""Celery state mapping — job polling vocabulary.

Business rules under test:
- Celery worker states collapse to the same status words the HTTP job API exposes.
"""

from __future__ import annotations

from arch_decisions.services.jobs.get_architecture_job_service import map_celery_state


def test_when_celery_states_are_mapped_then_match_job_poll_vocabulary() -> None:
    """
    Given
    - Raw Celery states (pending, started, success, failure, retry, and unknown).
    When
    - Each state is mapped for API polling.
    Then
    - Clients see waiting, active, completed, failed, delayed, or unknown.
    """
    # Arrange
    expected_by_celery_state = {
        "PENDING": "waiting",
        "STARTED": "active",
        "SUCCESS": "completed",
        "FAILURE": "failed",
        "RETRY": "delayed",
        "OTHER": "unknown",
    }

    # Act
    mapped = {
        celery_state: map_celery_state(celery_state)
        for celery_state in expected_by_celery_state
    }

    # Assert
    assert mapped == expected_by_celery_state
