import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';

export interface RecommendationProvider {
    evaluateAll(context: ProjectContext): Promise<RecommendationsResponse>;
}
