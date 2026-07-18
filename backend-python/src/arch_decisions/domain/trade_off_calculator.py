from __future__ import annotations

from arch_decisions.domain.recommendation_category import RecommendationCategory, TradeOffs

TRADE_OFF_MAP: dict[RecommendationCategory, dict[str, TradeOffs]] = {
    "compute": {
        "EC2": TradeOffs(cost="low", complexity="low", risk="low", operationalOverhead="medium"),
        "ECS": TradeOffs(cost="medium", complexity="medium", risk="low", operationalOverhead="low"),
        "EKS": TradeOffs(cost="high", complexity="high", risk="medium", operationalOverhead="high"),
        "Lambda": TradeOffs(cost="low", complexity="medium", risk="low", operationalOverhead="low"),
    },
    "secrets": {
        "AWS Parameter Store": TradeOffs(
            cost="low", complexity="low", risk="medium", operationalOverhead="low"
        ),
        "AWS Secrets Manager": TradeOffs(
            cost="medium", complexity="low", risk="low", operationalOverhead="low"
        ),
        "HashiCorp Vault": TradeOffs(
            cost="medium", complexity="high", risk="low", operationalOverhead="high"
        ),
        "Environment Variables": TradeOffs(
            cost="low", complexity="low", risk="high", operationalOverhead="low"
        ),
    },
    "cicd": {
        "GitHub Actions": TradeOffs(
            cost="low", complexity="low", risk="low", operationalOverhead="low"
        ),
        "GitLab CI": TradeOffs(
            cost="medium", complexity="medium", risk="low", operationalOverhead="medium"
        ),
        "Jenkins": TradeOffs(
            cost="medium", complexity="high", risk="low", operationalOverhead="high"
        ),
        "AWS CodePipeline": TradeOffs(
            cost="medium", complexity="medium", risk="low", operationalOverhead="medium"
        ),
    },
}


def calculate_trade_offs(category: RecommendationCategory, option: str) -> TradeOffs:
    """Return known trade-offs, or medium across the board for unknown options."""
    category_map = TRADE_OFF_MAP.get(category, {})
    return category_map.get(
        option,
        TradeOffs(cost="medium", complexity="medium", risk="medium", operationalOverhead="medium"),
    )
