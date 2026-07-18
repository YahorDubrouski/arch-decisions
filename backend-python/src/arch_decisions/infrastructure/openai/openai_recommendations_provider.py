from __future__ import annotations

import json

from pydantic import BaseModel, Field, ValidationError

from arch_decisions.core.config.openai import get_openai_settings
from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendation_category import RecommendationCategory
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.domain.trade_off_calculator import calculate_trade_offs
from arch_decisions.infrastructure.openai.openai_gateway import OpenAIGateway
from arch_decisions.services.recommendations.recommendation_provider import RecommendationProvider


class _RawOption(BaseModel):
    recommended: str
    alternatives: list[str] = Field(min_length=1)


class _RawRecommendations(BaseModel):
    compute: _RawOption
    secrets: _RawOption
    cicd: _RawOption


def _build_prompt(context: ProjectContext) -> str:
    compliance = ", ".join(context.complianceRequirements) or "none"
    return f"""You are an expert cloud architect. Given this project context, recommend one option per category and 2-3 alternatives.

Context:
- Team size: {context.teamSize}
- Traffic pattern: {context.trafficPattern}
- Budget sensitivity: {context.budgetSensitivity}
- Compliance: {compliance}
- Operational maturity: {context.operationalMaturity}

Respond with JSON only, no markdown, in this exact shape:
{{
  "compute": {{ "recommended": "<one of: EC2, ECS, EKS, Lambda>", "alternatives": ["option2", "option3"] }},
  "secrets": {{ "recommended": "<one of: AWS Parameter Store, AWS Secrets Manager, HashiCorp Vault, Environment Variables>", "alternatives": ["option2", "option3"] }},
  "cicd": {{ "recommended": "<one of: GitHub Actions, GitLab CI, Jenkins, AWS CodePipeline>", "alternatives": ["option2", "option3"] }}
}}"""


def _map_option(category: RecommendationCategory, raw: _RawOption) -> dict[str, object]:
    return {
        "category": category,
        "recommended": raw.recommended,
        "alternatives": raw.alternatives,
        "tradeOffs": calculate_trade_offs(category, raw.recommended),
    }


class OpenAIRecommendationsProvider:
    def __init__(self, gateway: OpenAIGateway | None = None) -> None:
        self._gateway = gateway or OpenAIGateway()

    async def evaluate_all(self, context: ProjectContext) -> RecommendationsResponse:
        settings = get_openai_settings()
        content = await self._gateway.fetch_completion_content(
            "recommendations.evaluate",
            model=settings.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": "You respond only with valid JSON. No explanation, no markdown code fences.",
                },
                {"role": "user", "content": _build_prompt(context)},
            ],
            temperature=0.3,
        )
        try:
            raw = _RawRecommendations.model_validate(json.loads(content))
        except (json.JSONDecodeError, ValidationError) as error:
            raise ValueError(f"Invalid OpenAI response shape: {error}. Raw: {content[:200]}") from error

        return RecommendationsResponse.model_validate(
            {
                "compute": _map_option("compute", raw.compute),
                "secrets": _map_option("secrets", raw.secrets),
                "cicd": _map_option("cicd", raw.cicd),
            }
        )


def create_openai_recommendations_provider() -> RecommendationProvider:
    return OpenAIRecommendationsProvider()
