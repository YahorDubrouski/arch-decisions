from __future__ import annotations

from arch_decisions.domain.context import ProjectContext


def make_project_context(**overrides: object) -> ProjectContext:
    payload: dict[str, object] = {
        "teamSize": "1-5",
        "trafficPattern": "low-steady",
        "budgetSensitivity": "cost-optimized",
        "complianceRequirements": [],
        "operationalMaturity": "minimal",
    }
    payload.update(overrides)
    return ProjectContext.model_validate(payload)
