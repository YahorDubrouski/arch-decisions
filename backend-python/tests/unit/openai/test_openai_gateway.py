"""OpenAI gateway — retry on transient upstream failures.

Business rules under test:
- Temporary OpenAI failures are retried before succeeding.
- Exhausted retries surface as an upstream service error.
"""

from __future__ import annotations

import pytest

from arch_decisions.core.errors import UpstreamServiceError
from arch_decisions.infrastructure.openai.openai_gateway import OpenAIGateway


class _FakeCompletions:
    def __init__(self, failures: int) -> None:
        self.failures = failures
        self.calls = 0

    async def create(self, **kwargs: object) -> object:
        self.calls += 1
        if self.calls <= self.failures:

            class TransientError(Exception):
                status_code = 503

            raise TransientError("busy")

        class Message:
            content = '{"ok": true}'

        class Choice:
            message = Message()

        class Completion:
            choices = [Choice()]

        return Completion()


class _FakeChat:
    def __init__(self, completions: _FakeCompletions) -> None:
        self.completions = completions


class _FakeClient:
    def __init__(self, completions: _FakeCompletions) -> None:
        self.chat = _FakeChat(completions)


@pytest.mark.asyncio
async def test_when_openai_is_temporarily_busy_then_retry_until_success() -> None:
    """
    Given
    - OpenAI fails twice with a transient error, then succeeds.
    - The gateway allows two retries.
    When
    - Completion content is fetched.
    Then
    - The successful payload is returned after three attempts.
    """
    # Arrange
    completions = _FakeCompletions(failures=2)
    gateway = OpenAIGateway(client=_FakeClient(completions), max_retries=2)  # type: ignore[arg-type]

    # Act
    content = await gateway.fetch_completion_content(
        "test",
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "hi"}],
    )

    # Assert
    assert content == '{"ok": true}'
    assert completions.calls == 3


@pytest.mark.asyncio
async def test_when_openai_keeps_failing_then_raise_upstream_service_error() -> None:
    """
    Given
    - OpenAI keeps failing with transient errors.
    - The gateway allows only one retry.
    When
    - Completion content is fetched.
    Then
    - An upstream service error is raised for the caller.
    """
    # Arrange
    completions = _FakeCompletions(failures=5)
    gateway = OpenAIGateway(client=_FakeClient(completions), max_retries=1)  # type: ignore[arg-type]

    # Act / Assert
    with pytest.raises(UpstreamServiceError):
        await gateway.fetch_completion_content(
            "test",
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "hi"}],
        )
