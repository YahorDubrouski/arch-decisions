import type {ProjectContext} from '@/domain/context';
import {calculateTradeOffs} from '@/domain/calculateTradeOffs';
import type {RecommendationsResponse} from '@/domain/recommendations';

/**
 * Deterministic recommendations (mirrors backend mock/template path).
 * Used by LocalRecommendationsGateway when `VITE_DATA_SOURCE=local`.
 */
export function evaluateRecommendationsLocally(context: ProjectContext): RecommendationsResponse {
    // Rule order matters. Example: team 1-5 + cost-optimized → EC2; 21-50 + high-spike → EKS; else → ECS.
    const compute =
        context.teamSize === '1-5' && context.budgetSensitivity === 'cost-optimized'
            ? {recommended: 'EC2', alternatives: ['ECS', 'Lambda']}
            : context.teamSize === '21-50' && context.trafficPattern === 'high-spike'
              ? {recommended: 'EKS', alternatives: ['ECS', 'EC2']}
              : {recommended: 'ECS', alternatives: ['EKS', 'EC2']};

    // Example: compliance includes SOC2 → AWS Secrets Manager; otherwise → AWS Parameter Store.
    const secrets =
        context.complianceRequirements.includes('SOC2') ||
        context.complianceRequirements.includes('HIPAA')
            ? {
                  recommended: 'AWS Secrets Manager',
                  alternatives: ['HashiCorp Vault', 'AWS Parameter Store'],
              }
            : {
                  recommended: 'AWS Parameter Store',
                  alternatives: ['AWS Secrets Manager', 'Environment Variables'],
              };

    // Example: cost-optimized and team not 50+ → GitHub Actions; otherwise → GitLab CI.
    const cicd =
        context.budgetSensitivity === 'cost-optimized' && context.teamSize !== '50+'
            ? {recommended: 'GitHub Actions', alternatives: ['GitLab CI', 'Jenkins']}
            : {recommended: 'GitLab CI', alternatives: ['GitHub Actions', 'AWS CodePipeline']};

    return {
        compute: {
            category: 'compute',
            recommended: compute.recommended,
            alternatives: compute.alternatives,
            tradeOffs: calculateTradeOffs('compute', compute.recommended),
        },
        secrets: {
            category: 'secrets',
            recommended: secrets.recommended,
            alternatives: secrets.alternatives,
            tradeOffs: calculateTradeOffs('secrets', secrets.recommended),
        },
        cicd: {
            category: 'cicd',
            recommended: cicd.recommended,
            alternatives: cicd.alternatives,
            tradeOffs: calculateTradeOffs('cicd', cicd.recommended),
        },
    };
}
