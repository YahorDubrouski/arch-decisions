import {createArchitectureDecisionGeneratorProvider} from '@/integrations/openai/architecture-decision-provider.factory';
import {OpenAIArchitectureDecisionProvider} from '@/integrations/openai/openai-architecture-decision.provider';
import {TemplateArchitectureDecisionProvider} from '@/integrations/openai/template-architecture-decision.provider';

describe('createArchitectureDecisionGeneratorProvider', () => {
    const originalProvider = process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER;
    const originalApiKey = process.env.OPENAI_API_KEY;

    afterEach(() => {
        if (originalProvider === undefined) {
            delete process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER;
        } else {
            process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = originalProvider;
        }

        if (originalApiKey === undefined) {
            delete process.env.OPENAI_API_KEY;
        } else {
            process.env.OPENAI_API_KEY = originalApiKey;
        }
    });

    it('creates template provider by default', () => {
        delete process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER;

        const provider = createArchitectureDecisionGeneratorProvider();

        expect(provider).toBeInstanceOf(TemplateArchitectureDecisionProvider);
    });

    it('creates template provider when configured explicitly', () => {
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'template';

        const provider = createArchitectureDecisionGeneratorProvider();

        expect(provider).toBeInstanceOf(TemplateArchitectureDecisionProvider);
    });

    it('creates openai provider when configured with api key', () => {
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'openai';
        process.env.OPENAI_API_KEY = 'test-api-key';

        const provider = createArchitectureDecisionGeneratorProvider();

        expect(provider).toBeInstanceOf(OpenAIArchitectureDecisionProvider);
    });

    it('throws when openai is configured without api key', () => {
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'openai';
        delete process.env.OPENAI_API_KEY;

        expect(() => createArchitectureDecisionGeneratorProvider()).toThrow(
            'ARCHITECTURE_DECISION_GENERATOR_PROVIDER is openai but OPENAI_API_KEY is not set.'
        );
    });

    it('throws when provider config is invalid', () => {
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'unknown';

        expect(() => createArchitectureDecisionGeneratorProvider()).toThrow(
            'Invalid ARCHITECTURE_DECISION_GENERATOR_PROVIDER: unknown. Expected template or openai.'
        );
    });
});
