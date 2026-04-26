import {EvaluateDecisionsService} from '../evaluate-decisions.service';
import type {ProjectContext} from '../../../domain/context';
import {createTestMockDecisionProvider} from '../../../integrations/openai/openai.mock.provider';

function context(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    teamSize: '6-20',
    trafficPattern: 'variable',
    budgetSensitivity: 'balanced',
    complianceRequirements: [],
    operationalMaturity: 'moderate',
    ...overrides,
  };
}

describe('EvaluateDecisionsService', () => {
  let service: EvaluateDecisionsService;

  beforeEach(() => {
    service = new EvaluateDecisionsService(createTestMockDecisionProvider());
  });

  it('returns decisions for all categories', async () => {
    const result = await service.evaluateAll(context({complianceRequirements: ['SOC2']}));
    expect(result.compute.category).toBe('compute');
    expect(result.secrets.category).toBe('secrets');
    expect(result.cicd.category).toBe('cicd');
  });

  it('recommends EC2 for small team with cost optimization', async () => {
    const result = await service.evaluateAll(context({teamSize: '1-5', budgetSensitivity: 'cost-optimized'}));
    expect(result.compute.recommended).toBe('EC2');
  });
});
