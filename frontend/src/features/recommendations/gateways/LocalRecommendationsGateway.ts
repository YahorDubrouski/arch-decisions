import type {ProjectContext} from '@/domain/context';
import type {RecommendationsResponse} from '@/domain/recommendations';
import {evaluateRecommendationsLocally} from '@/features/recommendations/domain/evaluateRecommendationsLocally';
import type {RecommendationsGateway} from './recommendationsGateway.port';

function assertNotAborted(signal?: AbortSignal): void {
    if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
    }
}

export function createLocalRecommendationsGateway(): RecommendationsGateway {
    return {
        async evaluateAll(
            context: ProjectContext,
            signal?: AbortSignal
        ): Promise<RecommendationsResponse> {
            assertNotAborted(signal);
            const recommendations = evaluateRecommendationsLocally(context);
            assertNotAborted(signal);
            return recommendations;
        },
    };
}
