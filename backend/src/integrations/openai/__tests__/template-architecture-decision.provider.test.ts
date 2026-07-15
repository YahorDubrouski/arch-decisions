import {TemplateArchitectureDecisionProvider} from '@/integrations/openai/template-architecture-decision.provider';
import {buildDecisionsResponse} from '@/test/fixtures/decisions-response.fixture';
import {buildProjectContext} from '@/test/fixtures/project-context.fixture';

describe('TemplateArchitectureDecisionProvider', () => {
    it('builds architecture decision draft from context and decisions', async () => {
        const provider = new TemplateArchitectureDecisionProvider();
        const draft = await provider.generate(buildProjectContext(), buildDecisionsResponse());

        expect(draft.status).toBe('proposed');
        expect(draft.title).toBe('Cloud Architecture Decisions');
        expect(draft.content).toContain('## Context');
        expect(draft.content).toContain('ECS');
        expect(draft.summary).toContain('ECS');
    });
});
