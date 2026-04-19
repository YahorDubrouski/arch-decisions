// Domain: Predefined decision categories

export type DecisionCategory = 'compute' | 'secrets' | 'cicd';

export const DECISION_CATEGORIES: DecisionCategory[] = ['compute', 'secrets', 'cicd'];

export type TradeOffLevel = 'low' | 'medium' | 'high';

export interface TradeOffs {
    cost: TradeOffLevel;
    complexity: TradeOffLevel;
    risk: TradeOffLevel;
    operationalOverhead: TradeOffLevel;
}

export interface DecisionResult {
    category: DecisionCategory;
    recommended: string;
    alternatives: string[];
    tradeOffs: TradeOffs;
}
