import type {RecommendationProvider} from '@/services/recommendations/recommendation-provider.js';
import {getRecommendationProvider} from '@/config/recommendation-provider.config.js';
import {getOpenAIConfig} from '@/config/openai.config.js';
import {createTestMockRecommendationProvider} from '@/integrations/openai/openai.mock.provider.js';
import {OpenAIRecommendationsProvider} from '@/integrations/openai/openai-recommendations.provider.js';

export function createRecommendationProvider(): RecommendationProvider {
    const configuredProvider = getRecommendationProvider();

    if (configuredProvider === 'mock') {
        return createTestMockRecommendationProvider();
    }

    const {apiKey} = getOpenAIConfig();
    if (!apiKey) {
        throw new Error('RECOMMENDATION_PROVIDER is openai but OPENAI_API_KEY is not set.');
    }

    return new OpenAIRecommendationsProvider();
}
