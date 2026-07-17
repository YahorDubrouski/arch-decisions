import type {ProjectContext} from '@/domain/context';
import {
    evaluateRecommendationsApiResponseSchema,
    type RecommendationsResponse,
} from '@/domain/recommendations';
import {enqueueAndWaitForJobResult} from '@/shared/api/enqueueAndWaitForJobResult';
import type {RecommendationsGateway} from './recommendationsGateway.port';

export function createHttpRecommendationsGateway(): RecommendationsGateway {
    return {
        async evaluateAll(
            context: ProjectContext,
            signal?: AbortSignal
        ): Promise<RecommendationsResponse> {
            const result = await enqueueAndWaitForJobResult(
                '/api/recommendations/evaluate',
                context,
                evaluateRecommendationsApiResponseSchema,
                signal
            );
            return result.recommendations;
        },
    };
}
