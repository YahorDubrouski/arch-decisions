export type RecommendationProviderName = 'mock' | 'openai';

export function getRecommendationProvider(): RecommendationProviderName {
    const configuredProvider = process.env.RECOMMENDATION_PROVIDER?.toLowerCase();

    if (configuredProvider === undefined) {
        return 'mock';
    }

    if (configuredProvider === 'mock' || configuredProvider === 'openai') {
        return configuredProvider;
    }

    throw new Error(
        `Invalid RECOMMENDATION_PROVIDER: ${process.env.RECOMMENDATION_PROVIDER}. Expected mock or openai.`
    );
}
