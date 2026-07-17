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

    /**
     * Given
     * - ARCHITECTURE_DECISION_GENERATOR_PROVIDER is unset.
     * When
     * - The architecture decision generator provider is created.
     * Then
     * - A template provider is returned.
     */
    it('when provider is unset then create template provider', () => {
        // Arrange
        delete process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER;

        // Act
        const provider = createArchitectureDecisionGeneratorProvider();

        // Assert
        expect(provider).toBeInstanceOf(TemplateArchitectureDecisionProvider);
    });

    /**
     * Given
     * - ARCHITECTURE_DECISION_GENERATOR_PROVIDER is template.
     * When
     * - The architecture decision generator provider is created.
     * Then
     * - A template provider is returned.
     */
    it('when provider is template then create template provider', () => {
        // Arrange
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'template';

        // Act
        const provider = createArchitectureDecisionGeneratorProvider();

        // Assert
        expect(provider).toBeInstanceOf(TemplateArchitectureDecisionProvider);
    });

    /**
     * Given
     * - ARCHITECTURE_DECISION_GENERATOR_PROVIDER is openai and OPENAI_API_KEY is set.
     * When
     * - The architecture decision generator provider is created.
     * Then
     * - An OpenAI provider is returned.
     */
    it('when provider is openai with api key then create openai provider', () => {
        // Arrange
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'openai';
        process.env.OPENAI_API_KEY = 'test-api-key';

        // Act
        const provider = createArchitectureDecisionGeneratorProvider();

        // Assert
        expect(provider).toBeInstanceOf(OpenAIArchitectureDecisionProvider);
    });

    /**
     * Given
     * - ARCHITECTURE_DECISION_GENERATOR_PROVIDER is openai and OPENAI_API_KEY is unset.
     * When
     * - The architecture decision generator provider is created.
     * Then
     * - Creation fails with a configuration error.
     */
    it('when openai is configured without api key then throw', () => {
        // Arrange
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'openai';
        delete process.env.OPENAI_API_KEY;

        // Act & Assert
        expect(() => createArchitectureDecisionGeneratorProvider()).toThrow(
            'ARCHITECTURE_DECISION_GENERATOR_PROVIDER is openai but OPENAI_API_KEY is not set.'
        );
    });

    /**
     * Given
     * - ARCHITECTURE_DECISION_GENERATOR_PROVIDER is an unknown value.
     * When
     * - The architecture decision generator provider is created.
     * Then
     * - Creation fails with an invalid provider error.
     */
    it('when provider config is invalid then throw', () => {
        // Arrange
        process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'unknown';

        // Act & Assert
        expect(() => createArchitectureDecisionGeneratorProvider()).toThrow(
            'Invalid ARCHITECTURE_DECISION_GENERATOR_PROVIDER: unknown. Expected template or openai.'
        );
    });
});
