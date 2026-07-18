from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

RecommendationCategory = Literal["compute", "secrets", "cicd"]
DECISION_CATEGORIES: list[RecommendationCategory] = ["compute", "secrets", "cicd"]

TradeOffLevel = Literal["low", "medium", "high"]


class TradeOffs(BaseModel):
    cost: TradeOffLevel
    complexity: TradeOffLevel
    risk: TradeOffLevel
    operationalOverhead: TradeOffLevel


class RecommendationResult(BaseModel):
    category: RecommendationCategory
    recommended: str
    alternatives: list[str]
    tradeOffs: TradeOffs
