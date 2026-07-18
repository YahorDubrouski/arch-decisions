from __future__ import annotations

from arch_decisions.domain.architecture_decision import (
    ARCHITECTURE_DECISION_STATUS,
    ArchitectureDecisionDraft,
)
from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendation_category import RecommendationResult
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.services.architecture_decisions.architecture_decision_generator import (
    ArchitectureDecisionGenerator,
)


def _format_recommendation_section(label: str, recommendation: RecommendationResult) -> str:
    return (
        f"- **{label}:** {recommendation.recommended}\n"
        f"  - Alternatives: {', '.join(recommendation.alternatives)}\n"
        f"  - Trade-offs: cost {recommendation.tradeOffs.cost}, "
        f"complexity {recommendation.tradeOffs.complexity}, "
        f"risk {recommendation.tradeOffs.risk}, "
        f"operational overhead {recommendation.tradeOffs.operationalOverhead}"
    )


def _build_content(context: ProjectContext, recommendations: RecommendationsResponse) -> str:
    compliance = ", ".join(context.complianceRequirements) or "none"
    return f"""# Architecture Decision Record

## Status
proposed

## Context
- Team size: {context.teamSize}
- Traffic pattern: {context.trafficPattern}
- Budget sensitivity: {context.budgetSensitivity}
- Compliance requirements: {compliance}
- Operational maturity: {context.operationalMaturity}

## Decision
{_format_recommendation_section("Compute", recommendations.compute)}

{_format_recommendation_section("Secrets", recommendations.secrets)}

{_format_recommendation_section("CI/CD", recommendations.cicd)}

## Consequences
- Aligns infrastructure choices with team size and operational maturity.
- Trade-offs balance cost, complexity, and compliance constraints.
- Recommended options reduce decision ambiguity for initial implementation.

## Alternatives Considered
- Compute alternatives: {", ".join(recommendations.compute.alternatives)}
- Secrets alternatives: {", ".join(recommendations.secrets.alternatives)}
- CI/CD alternatives: {", ".join(recommendations.cicd.alternatives)}

## Implementation Notes
- Validate recommendations against current cloud account standards.
- Revisit decisions when traffic patterns or compliance scope changes."""


def _build_summary(context: ProjectContext, recommendations: RecommendationsResponse) -> str:
    return (
        f"Proposed architecture for a {context.teamSize} team: "
        f"{recommendations.compute.recommended} (compute), "
        f"{recommendations.secrets.recommended} (secrets), and "
        f"{recommendations.cicd.recommended} (CI/CD), chosen for "
        f"{context.budgetSensitivity} budget profile and "
        f"{context.operationalMaturity} operational maturity."
    )


class TemplateArchitectureDecisionProvider:
    async def generate(
        self,
        context: ProjectContext,
        recommendations: RecommendationsResponse,
    ) -> ArchitectureDecisionDraft:
        return ArchitectureDecisionDraft(
            title="Cloud Architecture Decisions",
            status=ARCHITECTURE_DECISION_STATUS,
            content=_build_content(context, recommendations),
            summary=_build_summary(context, recommendations),
        )


def create_template_architecture_decision_provider() -> ArchitectureDecisionGenerator:
    return TemplateArchitectureDecisionProvider()
