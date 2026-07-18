"""Trade-off calculator — known options and safe fallback.

Business rules under test:
- Known compute options expose calibrated trade-offs.
- Unknown options fall back to a balanced medium profile.
"""

from __future__ import annotations

from arch_decisions.domain.trade_off_calculator import calculate_trade_offs


def test_when_compute_option_is_known_then_return_calibrated_trade_offs() -> None:
    """
    Given
    - Compute category and a known option (ECS).
    When
    - Trade-offs are calculated.
    Then
    - Cost is medium for that option.
    """
    # Arrange
    category = "compute"
    option = "ECS"

    # Act
    known = calculate_trade_offs(category, option)

    # Assert
    assert known.cost == "medium"


def test_when_compute_option_is_unknown_then_fall_back_to_medium_profile() -> None:
    """
    Given
    - Compute category and an unrecognized option name.
    When
    - Trade-offs are calculated.
    Then
    - Cost and complexity default to medium.
    """
    # Arrange
    category = "compute"
    option = "SomethingElse"

    # Act
    unknown = calculate_trade_offs(category, option)

    # Assert
    assert unknown.cost == "medium"
    assert unknown.complexity == "medium"
