from __future__ import annotations

from fastapi import APIRouter

from arch_decisions.api.routes import architecture_decisions, jobs, recommendations

api_router = APIRouter(prefix="/api")
api_router.include_router(recommendations.router)
api_router.include_router(architecture_decisions.router)
api_router.include_router(jobs.router)
