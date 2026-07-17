from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

TeamSize = Literal["1-5", "6-20", "21-50", "50+"]
TrafficPattern = Literal["low-steady", "variable", "high-spike", "unpredictable"]
BudgetSensitivity = Literal["cost-optimized", "balanced", "performance-first"]
OperationalMaturity = Literal["minimal", "moderate", "advanced", "enterprise"]


class ProjectContextSchema(BaseModel):
    teamSize: TeamSize = Field(
        ...,
        description="Engineering team size band used for compute recommendations.",
        examples=["1-5"],
    )
    trafficPattern: TrafficPattern = Field(
        ...,
        description="Expected traffic shape for the workload.",
        examples=["low-steady"],
    )
    budgetSensitivity: BudgetSensitivity = Field(
        ...,
        description="How strongly cost should outweigh performance.",
        examples=["cost-optimized"],
    )
    complianceRequirements: list[str] = Field(
        default_factory=list,
        description="Compliance regimes that affect secrets recommendations.",
        examples=[["SOC2", "HIPAA"]],
        max_length=20,
    )
    operationalMaturity: OperationalMaturity = Field(
        ...,
        description="Ops maturity of the team running the platform.",
        examples=["minimal"],
    )
