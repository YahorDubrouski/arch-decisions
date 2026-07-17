import {TemplateArchitectureDecisionProvider} from '@/integrations/openai/template-architecture-decision.provider';
import {buildRecommendationsResponse} from '@/test/fixtures/recommendations-response.fixture';
import {buildProjectContext} from '@/test/fixtures/project-context.fixture';

describe('TemplateArchitectureDecisionProvider', () => {
    /**
     * Given
     * - Project context and recommendation decisions.
     * When
     * - An architecture decision draft is generated.
     * Then
     * - A proposed draft with context and recommendation details is returned.
     */
    it('when context and decisions are provided then build architecture decision draft', async () => {
        // Arrange
        const provider = new TemplateArchitectureDecisionProvider();
        const context = buildProjectContext();
        const recommendations = buildRecommendationsResponse();

        // Act
        const draft = await provider.generate(context, recommendations);

        // Assert
        expect(draft.status).toBe('proposed');
        expect(draft.title).toBe('Cloud Architecture Decisions');
        expect(draft.content).toContain('## Context');
        expect(draft.content).toContain('ECS');
        expect(draft.summary).toContain('ECS');
    });
});
