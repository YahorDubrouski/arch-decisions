import type {DecisionsResponse} from '@/domain/DecisionsResponse';
import {calculateTradeOffs} from '@/domain/trade-off-calculator';

export function buildDecisionsResponse(overrides: Partial<DecisionsResponse> = {}): DecisionsResponse {
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
