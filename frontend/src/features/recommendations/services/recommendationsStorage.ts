import {RecommendationsResponse, recommendationsResponseSchema} from '@/domain/recommendations';

const RECOMMENDATIONS_STORAGE_KEY = 'arch-decisions:recommendations';

export function saveRecommendations(recommendations: RecommendationsResponse): void {
    sessionStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendations));
}

export function getRecommendations(): RecommendationsResponse | null {
    const rawValue = sessionStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = recommendationsResponseSchema.safeParse(JSON.parse(rawValue));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

export function clearRecommendations(): void {
    sessionStorage.removeItem(RECOMMENDATIONS_STORAGE_KEY);
}
