import {ProjectContext} from '@/domain/context';
import {
    DecisionsResponse,
    evaluateDecisionsApiResponseSchema,
} from '@/domain/decisions';
import {postJson} from '@/shared/api/httpClient';

export async function evaluateDecisions(
    context: ProjectContext,
    signal?: AbortSignal
): Promise<DecisionsResponse> {
    const response = await postJson(
        '/api/decisions/evaluate',
        context,
        evaluateDecisionsApiResponseSchema,
        {signal}
    );
    return response.decisions;
}
