import {EvaluateDecisionsService} from '@/services/decisions/evaluate-decisions.service';
import {createTestMockDecisionProvider} from '@/integrations/openai/openai.mock.provider';
import {buildProjectContext} from '@/test/fixtures/project-context.fixture';

describe('EvaluateDecisionsService', () => {
  let service: EvaluateDecisionsService;

  beforeEach(() => {
    service = new EvaluateDecisionsService(createTestMockDecisionProvider());
  });

  it('returns decisions for all categories', async () => {
    const result = await service.evaluateAll(buildProjectContext());
    expect(result.compute.category).toBe('compute');
    expect(result.secrets.category).toBe('secrets');
    expect(result.cicd.category).toBe('cicd');
  });

  it('recommends EC2 for small team with cost optimization', async () => {
    const result = await service.evaluateAll(
      buildProjectContext({teamSize: '1-5', budgetSensitivity: 'cost-optimized'})
    );
    expect(result.compute.recommended).toBe('EC2');
  });
});
