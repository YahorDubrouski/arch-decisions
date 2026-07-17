import {EvaluateRecommendationsService} from '@/services/recommendations/evaluate-recommendations.service';
import {createTestMockRecommendationProvider} from '@/integrations/openai/openai.mock.provider';
import {buildProjectContext} from '@/test/fixtures/project-context.fixture';

describe('EvaluateRecommendationsService', () => {
  let service: EvaluateRecommendationsService;

  beforeEach(() => {
    service = new EvaluateRecommendationsService(createTestMockRecommendationProvider());
  });

  /**
   * Given
   * - A default project context.
   * When
   * - Recommendations are evaluated for all categories.
   * Then
   * - Compute, secrets, and CI/CD recommendations are returned.
   */
  it('when project context is default then return recommendations for all categories', async () => {
    // Arrange
    const context = buildProjectContext();

    // Act
    const result = await service.evaluateAll(context);

    // Assert
    expect(result.compute.category).toBe('compute');
    expect(result.secrets.category).toBe('secrets');
    expect(result.cicd.category).toBe('cicd');
  });

  /**
   * Given
   * - Team size is 1-5 and budget is cost-optimized.
   * When
   * - Recommendations are evaluated.
   * Then
   * - Compute recommendation is EC2.
   */
  it('when team is small and cost-optimized then recommend EC2', async () => {
    // Arrange
    const context = buildProjectContext({teamSize: '1-5', budgetSensitivity: 'cost-optimized'});

    // Act
    const result = await service.evaluateAll(context);

    // Assert
    expect(result.compute.recommended).toBe('EC2');
  });
});
