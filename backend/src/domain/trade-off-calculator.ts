// Domain rule helper: maps option to trade-off levels

import type {DecisionCategory, TradeOffs} from './DecisionCategory.js';

type OptionName = string;

const TRADE_OFF_MAP: Record<DecisionCategory, Record<OptionName, TradeOffs>> = {
    compute: {
        EC2: {
            cost: 'low',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'medium',
        },
        ECS: {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'low',
        },
        EKS: {
            cost: 'high',
            complexity: 'high',
            risk: 'medium',
            operationalOverhead: 'high',
        },
        Lambda: {
            cost: 'low',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
    secrets: {
        'AWS Parameter Store': {
            cost: 'low',
            complexity: 'low',
            risk: 'medium',
            operationalOverhead: 'low',
        },
        'AWS Secrets Manager': {
            cost: 'medium',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
        'HashiCorp Vault': {
            cost: 'medium',
            complexity: 'high',
            risk: 'low',
            operationalOverhead: 'high',
        },
        'Environment Variables': {
            cost: 'low',
            complexity: 'low',
            risk: 'high',
            operationalOverhead: 'low',
        },
    },
    cicd: {
        'GitHub Actions': {
            cost: 'low',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
        'GitLab CI': {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'medium',
        },
        Jenkins: {
            cost: 'medium',
            complexity: 'high',
            risk: 'low',
            operationalOverhead: 'high',
        },
        'AWS CodePipeline': {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'medium',
        },
    },
};

/**
 * Returns trade-offs for a given category and option name.
 * Falls back to medium-across-the-board if option is unknown.
 */
export function calculateTradeOffs(
    category: DecisionCategory,
    option: string
): TradeOffs {
    const categoryMap = TRADE_OFF_MAP[category];
    const tradeOffs = categoryMap?.[option];
    if (tradeOffs) {
        return tradeOffs;
    }
    return {
        cost: 'medium',
        complexity: 'medium',
        risk: 'medium',
        operationalOverhead: 'medium',
    };
}
