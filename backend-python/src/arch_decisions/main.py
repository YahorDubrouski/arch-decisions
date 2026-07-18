from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from arch_decisions.api.middleware.correlation_id import CorrelationIdMiddleware
from arch_decisions.api.middleware.error_handlers import register_exception_handlers
from arch_decisions.api.middleware.security_headers import SecurityHeadersMiddleware
from arch_decisions.api.router import api_router
from arch_decisions.api.routes.health import router as health_router
from arch_decisions.container import get_container
from arch_decisions.core.config.app_env import get_app_env_settings
from arch_decisions.core.logging import configure_logging


def create_app() -> FastAPI:
    settings = get_app_env_settings()
    configure_logging(settings.log_level)

    # Cap request rate on /api similar to Express (120/min).
    limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

    app = FastAPI(
        title="Architecture Decisions API",
        version="1.0.0",
            description=(
                "Python backend for architecture decision recommendations and ADR generation. "
                "OpenAPI is generated from FastAPI routes; endpoint narrative lives in sibling *_docs.py files."
            ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(CorrelationIdMiddleware)
    app.add_middleware(SlowAPIMiddleware)

    register_exception_handlers(app)

    # Build container (seeds, providers) at startup.
    get_container()

    app.include_router(health_router)
    app.include_router(api_router)

    return app
