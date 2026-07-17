import {createRecommendationProvider} from '@/integrations/openai/recommendation-provider.factory';
import {OpenAIRecommendationsProvider} from '@/integrations/openai/openai-recommendations.provider';
import {MockRecommendationProvider} from '@/integrations/openai/openai.mock.provider';

describe('createRecommendationProvider', () => {
    const originalProvider = process.env.RECOMMENDATION_PROVIDER;
    const originalApiKey = process.env.OPENAI_API_KEY;

    afterEach(() => {
        if (originalProvider === undefined) {
            delete process.env.RECOMMENDATION_PROVIDER;
        } else {
            process.env.RECOMMENDATION_PROVIDER = originalProvider;
        }

        if (originalApiKey === undefined) {
            delete process.env.OPENAI_API_KEY;
        } else {
            process.env.OPENAI_API_KEY = originalApiKey;
        }
    });

    /**
     * Given
     * - RECOMMENDATION_PROVIDER is unset.
     * When
     * - The recommendation provider is created.
     * Then
     * - A mock provider is returned.
     */
    it('when provider is unset then create mock provider', () => {
        // Arrange
        delete process.env.RECOMMENDATION_PROVIDER;

        // Act
        const provider = createRecommendationProvider();

        // Assert
        expect(provider).toBeInstanceOf(MockRecommendationProvider);
    });

    /**
     * Given
     * - RECOMMENDATION_PROVIDER is mock.
     * When
     * - The recommendation provider is created.
     * Then
     * - A mock provider is returned.
     */
    it('when provider is mock then create mock provider', () => {
        // Arrange
        process.env.RECOMMENDATION_PROVIDER = 'mock';

        // Act
        const provider = createRecommendationProvider();

        // Assert
        expect(provider).toBeInstanceOf(MockRecommendationProvider);
    });

    /**
     * Given
     * - RECOMMENDATION_PROVIDER is openai and OPENAI_API_KEY is set.
     * When
     * - The recommendation provider is created.
     * Then
     * - An OpenAI provider is returned.
     */
    it('when provider is openai with api key then create openai provider', () => {
        // Arrange
        process.env.RECOMMENDATION_PROVIDER = 'openai';
        process.env.OPENAI_API_KEY = 'test-api-key';

        // Act
        const provider = createRecommendationProvider();

        // Assert
        expect(provider).toBeInstanceOf(OpenAIRecommendationsProvider);
    });

    /**
     * Given
     * - RECOMMENDATION_PROVIDER is openai and OPENAI_API_KEY is unset.
     * When
     * - The recommendation provider is created.
     * Then
     * - Creation fails with a configuration error.
     */
    it('when openai is configured without api key then throw', () => {
        // Arrange
        process.env.RECOMMENDATION_PROVIDER = 'openai';
        delete process.env.OPENAI_API_KEY;

        // Act & Assert
        expect(() => createRecommendationProvider()).toThrow(
            'RECOMMENDATION_PROVIDER is openai but OPENAI_API_KEY is not set.'
        );
    });

    /**
     * Given
     * - RECOMMENDATION_PROVIDER is an unknown value.
     * When
     * - The recommendation provider is created.
     * Then
     * - Creation fails with an invalid provider error.
     */
    it('when provider config is invalid then throw', () => {
        // Arrange
        process.env.RECOMMENDATION_PROVIDER = 'unknown';

        // Act & Assert
        expect(() => createRecommendationProvider()).toThrow(
            'Invalid RECOMMENDATION_PROVIDER: unknown. Expected mock or openai.'
        );
    });
});
