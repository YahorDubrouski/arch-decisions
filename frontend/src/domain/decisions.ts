export type DecisionCategory = 'compute' | 'secrets' | 'cicd';

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

export interface DecisionsResponse {
    compute: DecisionResult & {category: 'compute'};
    secrets: DecisionResult & {category: 'secrets'};
    cicd: DecisionResult & {category: 'cicd'};
}

export interface EvaluateDecisionsApiResponse {
    decisions: DecisionsResponse;
}
