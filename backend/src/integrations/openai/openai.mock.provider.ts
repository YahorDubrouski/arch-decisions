import type {ProjectContext} from '../../domain/context.js';
import type {DecisionsResponse} from '../../domain/DecisionsResponse.js';
import type {DecisionProviderPort} from '../../services/decisions/decision-provider.port.js';
import {calculateTradeOffs} from '../../domain/trade-off-calculator.js';

export function createTestMockDecisionProvider(): DecisionProviderPort {
  return {
    async evaluateAll(context: ProjectContext): Promise<DecisionsResponse> {
      const compute =
        context.teamSize === '1-5' && context.budgetSensitivity === 'cost-optimized'
          ? {recommended: 'EC2', alternatives: ['ECS', 'Lambda']}
          : context.teamSize === '21-50' && context.trafficPattern === 'high-spike'
            ? {recommended: 'EKS', alternatives: ['ECS', 'EC2']}
            : {recommended: 'ECS', alternatives: ['EKS', 'EC2']};

      const secrets =
        context.complianceRequirements.includes('SOC2') || context.complianceRequirements.includes('HIPAA')
          ? {recommended: 'AWS Secrets Manager', alternatives: ['HashiCorp Vault', 'AWS Parameter Store']}
          : {recommended: 'AWS Parameter Store', alternatives: ['AWS Secrets Manager', 'Environment Variables']};

      const cicd =
        context.budgetSensitivity === 'cost-optimized' && context.teamSize !== '50+'
          ? {recommended: 'GitHub Actions', alternatives: ['GitLab CI', 'Jenkins']}
          : {recommended: 'GitLab CI', alternatives: ['GitHub Actions', 'AWS CodePipeline']};

      return {
        compute: {category: 'compute', recommended: compute.recommended, alternatives: compute.alternatives, tradeOffs: calculateTradeOffs('compute', compute.recommended)},
        secrets: {category: 'secrets', recommended: secrets.recommended, alternatives: secrets.alternatives, tradeOffs: calculateTradeOffs('secrets', secrets.recommended)},
        cicd: {category: 'cicd', recommended: cicd.recommended, alternatives: cicd.alternatives, tradeOffs: calculateTradeOffs('cicd', cicd.recommended)},
      };
    },
  };
}
