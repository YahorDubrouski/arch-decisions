from __future__ import annotations

import json
from typing import Literal

from pydantic import BaseModel, ValidationError

from arch_decisions.core.config.openai import get_openai_settings
from arch_decisions.domain.architecture_decision import ArchitectureDecisionDraft
from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.infrastructure.openai.openai_gateway import OpenAIGateway
from arch_decisions.services.architecture_decisions.architecture_decision_generator import (
    ArchitectureDecisionGenerator,
)


class _RawArchitectureDecision(BaseModel):
    title: str
    status: Literal["proposed"]
    content: str
    summary: str


def _build_prompt(context: ProjectContext, recommendations: RecommendationsResponse) -> str:
    compliance = ", ".join(context.complianceRequirements) or "none"
    return f"""You are an expert software architect. Write an Architecture Decision Record in markdown.

Project context:
- Team size: {context.teamSize}
- Traffic pattern: {context.trafficPattern}
- Budget sensitivity: {context.budgetSensitivity}
- Compliance: {compliance}
- Operational maturity: {context.operationalMaturity}

Recommended options:
- Compute: {recommendations.compute.recommended} (alternatives: {", ".join(recommendations.compute.alternatives)})
- Secrets: {recommendations.secrets.recommended} (alternatives: {", ".join(recommendations.secrets.alternatives)})
- CI/CD: {recommendations.cicd.recommended} (alternatives: {", ".join(recommendations.cicd.alternatives)})

Respond with JSON only, no markdown fences, in this exact shape:
{{
  "title": "short decision record title",
  "status": "proposed",
  "content": "full markdown with sections: Status, Context, Decision, Consequences, Alternatives Considered, Implementation Notes",
  "summary": "2-3 sentence executive summary"
}}"""


class OpenAIArchitectureDecisionProvider:
    def __init__(self, gateway: OpenAIGateway | None = None) -> None:
        self._gateway = gateway or OpenAIGateway()

    async def generate(
        self,
        context: ProjectContext,
        recommendations: RecommendationsResponse,
    ) -> ArchitectureDecisionDraft:
        settings = get_openai_settings()
        content = await self._gateway.fetch_completion_content(
            "architecture-decision.generate",
            model=settings.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": "You respond only with valid JSON. No explanation, no markdown code fences.",
                },
                {"role": "user", "content": _build_prompt(context, recommendations)},
            ],
            temperature=0.3,
        )
        try:
            parsed = _RawArchitectureDecision.model_validate(json.loads(content))
        except (json.JSONDecodeError, ValidationError) as error:
            raise ValueError(f"Invalid OpenAI architecture decision response shape: {error}") from error
        return ArchitectureDecisionDraft.model_validate(parsed.model_dump())


def create_openai_architecture_decision_provider() -> ArchitectureDecisionGenerator:
    return OpenAIArchitectureDecisionProvider()
