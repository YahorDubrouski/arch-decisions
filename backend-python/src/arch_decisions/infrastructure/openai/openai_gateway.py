from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from typing import TypeVar

from openai import AsyncOpenAI

from arch_decisions.core.config.openai import get_openai_settings
from arch_decisions.core.errors import UpstreamServiceError
from arch_decisions.core.logging import get_logger

logger = get_logger(__name__)
T = TypeVar("T")


class OpenAIGateway:
    def __init__(
        self,
        client: AsyncOpenAI | None = None,
        max_retries: int | None = None,
    ) -> None:
        settings = get_openai_settings()
        timeout_seconds = settings.openai_timeout_ms / 1000
        self._client = client or AsyncOpenAI(
            api_key=settings.openai_api_key or None,
            timeout=timeout_seconds,
            max_retries=0,
        )
        self._max_retries = max_retries if max_retries is not None else settings.openai_max_retries

    async def fetch_completion_content(
        self,
        operation_name: str,
        *,
        model: str,
        messages: list[dict[str, str]],
        temperature: float = 0.3,
    ) -> str:
        completion = await self._retry(
            operation_name,
            lambda: self._client.chat.completions.create(
                model=model,
                messages=messages,  # type: ignore[arg-type]
                temperature=temperature,
                response_format={"type": "json_object"},
            ),
        )
        content = completion.choices[0].message.content
        if not content:
            raise UpstreamServiceError("Empty response from OpenAI")
        return content

    async def _retry(
        self,
        operation_name: str,
        operation: Callable[[], Awaitable[T]],
    ) -> T:
        attempt = 0
        last_error: Exception | None = None

        while attempt <= self._max_retries:
            try:
                return await operation()
            except Exception as error:  # noqa: BLE001 — gateway maps to UpstreamServiceError
                last_error = error
                if not _is_retryable(error) or attempt == self._max_retries:
                    break
                # Wait longer after each failed try so a busy OpenAI service can recover.
                # Example: attempt 0 → wait 250ms; attempt 1 → wait 500ms; attempt 2 → wait 1000ms.
                delay_ms = 250 * (2**attempt)
                logger.warning(
                    "Retrying OpenAI operation after transient failure",
                    operationName=operation_name,
                    attempt=attempt + 1,
                    delayMs=delay_ms,
                    message=str(error),
                )
                await asyncio.sleep(delay_ms / 1000)
                attempt += 1

        raise UpstreamServiceError(
            f"OpenAI {operation_name} failed",
            str(last_error) if last_error else "unknown error",
        )


def _is_retryable(error: Exception) -> bool:
    status = getattr(error, "status_code", None) or getattr(error, "status", None)
    if status == 429 or (isinstance(status, int) and status >= 500):
        return True
    code = str(getattr(error, "code", "") or "")
    return code in {"ETIMEDOUT", "ECONNRESET", "ENOTFOUND"}
