from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

TeamSize = Literal["1-5", "6-20", "21-50", "50+"]
TrafficPattern = Literal["low-steady", "variable", "high-spike", "unpredictable"]
BudgetSensitivity = Literal["cost-optimized", "balanced", "performance-first"]
OperationalMaturity = Literal["minimal", "moderate", "advanced", "enterprise"]


class ProjectContext(BaseModel):
    teamSize: TeamSize
    trafficPattern: TrafficPattern
    budgetSensitivity: BudgetSensitivity
    complianceRequirements: list[str] = Field(default_factory=list)
    operationalMaturity: OperationalMaturity
