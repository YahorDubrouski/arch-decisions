from __future__ import annotations

from arch_decisions.domain.recommendation_category import RecommendationResult, TradeOffs
from arch_decisions.domain.recommendations_response import RecommendationsResponse


def make_recommendations_response() -> RecommendationsResponse:
    return RecommendationsResponse(
        compute=RecommendationResult(
            category="compute",
            recommended="EC2",
            alternatives=["ECS", "Lambda"],
            tradeOffs=TradeOffs(
                cost="low", complexity="low", risk="low", operationalOverhead="medium"
            ),
        ),
        secrets=RecommendationResult(
            category="secrets",
            recommended="AWS Parameter Store",
            alternatives=["AWS Secrets Manager", "Environment Variables"],
            tradeOffs=TradeOffs(
                cost="low", complexity="low", risk="medium", operationalOverhead="low"
            ),
        ),
        cicd=RecommendationResult(
            category="cicd",
            recommended="GitHub Actions",
            alternatives=["GitLab CI", "Jenkins"],
            tradeOffs=TradeOffs(
                cost="low", complexity="low", risk="low", operationalOverhead="low"
            ),
        ),
    )
