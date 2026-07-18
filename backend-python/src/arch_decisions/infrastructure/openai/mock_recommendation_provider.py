from __future__ import annotations

from arch_decisions.domain.context import ProjectContext
from arch_decisions.domain.recommendations_response import RecommendationsResponse
from arch_decisions.domain.trade_off_calculator import calculate_trade_offs
from arch_decisions.services.recommendations.recommendation_provider import RecommendationProvider


class MockRecommendationProvider:
    async def evaluate_all(self, context: ProjectContext) -> RecommendationsResponse:
        # Same rules as the Express mock / frontend local evaluator.
        # Example: team 1-5 + cost-optimized → EC2; 21-50 + high-spike → EKS; else → ECS.
        if context.teamSize == "1-5" and context.budgetSensitivity == "cost-optimized":
            compute = {"recommended": "EC2", "alternatives": ["ECS", "Lambda"]}
        elif context.teamSize == "21-50" and context.trafficPattern == "high-spike":
            compute = {"recommended": "EKS", "alternatives": ["ECS", "EC2"]}
        else:
            compute = {"recommended": "ECS", "alternatives": ["EKS", "EC2"]}

        if "SOC2" in context.complianceRequirements or "HIPAA" in context.complianceRequirements:
            secrets = {
                "recommended": "AWS Secrets Manager",
                "alternatives": ["HashiCorp Vault", "AWS Parameter Store"],
            }
        else:
            secrets = {
                "recommended": "AWS Parameter Store",
                "alternatives": ["AWS Secrets Manager", "Environment Variables"],
            }

        if context.budgetSensitivity == "cost-optimized" and context.teamSize != "50+":
            cicd = {"recommended": "GitHub Actions", "alternatives": ["GitLab CI", "Jenkins"]}
        else:
            cicd = {
                "recommended": "GitLab CI",
                "alternatives": ["GitHub Actions", "AWS CodePipeline"],
            }

        return RecommendationsResponse(
            compute={
                "category": "compute",
                "recommended": compute["recommended"],
                "alternatives": compute["alternatives"],
                "tradeOffs": calculate_trade_offs("compute", compute["recommended"]),
            },
            secrets={
                "category": "secrets",
                "recommended": secrets["recommended"],
                "alternatives": secrets["alternatives"],
                "tradeOffs": calculate_trade_offs("secrets", secrets["recommended"]),
            },
            cicd={
                "category": "cicd",
                "recommended": cicd["recommended"],
                "alternatives": cicd["alternatives"],
                "tradeOffs": calculate_trade_offs("cicd", cicd["recommended"]),
            },
        )


def create_mock_recommendation_provider() -> RecommendationProvider:
    return MockRecommendationProvider()
