from __future__ import annotations

from typing import Any


class AppError(Exception):
    def __init__(self, message: str, status_code: int, details: Any | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class BadRequestError(AppError):
    def __init__(self, message: str, details: Any | None = None) -> None:
        super().__init__(message, 400, details)


class NotFoundError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, 404)


class UpstreamServiceError(AppError):
    def __init__(self, message: str, details: Any | None = None) -> None:
        super().__init__(message, 502, details)
