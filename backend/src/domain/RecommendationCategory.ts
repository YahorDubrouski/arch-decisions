// Domain: Predefined decision categories

export type RecommendationCategory = 'compute' | 'secrets' | 'cicd';

export const DECISION_CATEGORIES: RecommendationCategory[] = ['compute', 'secrets', 'cicd'];

export type TradeOffLevel = 'low' | 'medium' | 'high';

export interface TradeOffs {
    cost: TradeOffLevel;
    complexity: TradeOffLevel;
    risk: TradeOffLevel;
    operationalOverhead: TradeOffLevel;
}

export interface RecommendationResult {
    category: RecommendationCategory;
    recommended: string;
    alternatives: string[];
    tradeOffs: TradeOffs;
}
