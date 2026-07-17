import type {RecommendationsResponse} from '@/domain/RecommendationsResponse';
import {calculateTradeOffs} from '@/domain/trade-off-calculator';

export function buildRecommendationsResponse(overrides: Partial<RecommendationsResponse> = {}): RecommendationsResponse {
    return {
        compute: {
            category: 'compute',
            recommended: 'ECS',
            alternatives: ['EC2', 'EKS'],
            tradeOffs: calculateTradeOffs('compute', 'ECS'),
            ...overrides.compute,
        },
        secrets: {
            category: 'secrets',
            recommended: 'AWS Secrets Manager',
            alternatives: ['HashiCorp Vault'],
            tradeOffs: calculateTradeOffs('secrets', 'AWS Secrets Manager'),
            ...overrides.secrets,
        },
        cicd: {
            category: 'cicd',
            recommended: 'GitHub Actions',
            alternatives: ['GitLab CI'],
            tradeOffs: calculateTradeOffs('cicd', 'GitHub Actions'),
            ...overrides.cicd,
        },
    };
}
