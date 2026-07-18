from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from arch_decisions.core.errors import AppError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
        correlation_id = getattr(request.state, "correlation_id", None)
        body: dict[str, object] = {"error": exc.message}
        if exc.details is not None:
            body["details"] = exc.details
        if correlation_id:
            body["correlationId"] = correlation_id
        return JSONResponse(status_code=exc.status_code, content=body)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        correlation_id = getattr(request.state, "correlation_id", None)
        body: dict[str, object] = {
            "error": "Invalid request",
            "details": exc.errors(),
        }
        if correlation_id:
            body["correlationId"] = correlation_id
        return JSONResponse(status_code=400, content=body)

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        correlation_id = getattr(request.state, "correlation_id", None)
        body: dict[str, object] = {"error": "Internal server error"}
        if correlation_id:
            body["correlationId"] = correlation_id
        return JSONResponse(status_code=500, content=body)
