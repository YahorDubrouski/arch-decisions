import type {ProjectContext} from '@/domain/context';
import type {RecommendationsResponse} from '@/domain/recommendations';

export type RecommendationsGateway = {
    evaluateAll(context: ProjectContext, signal?: AbortSignal): Promise<RecommendationsResponse>;
};
