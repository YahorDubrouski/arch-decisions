import {ProjectContext} from '@/domain/context';
import {DecisionsResponse, EvaluateDecisionsApiResponse} from '@/domain/decisions';
import {postJson} from '@/shared/api/httpClient';

export async function evaluateDecisions(context: ProjectContext): Promise<DecisionsResponse> {
    const response = await postJson<ProjectContext, EvaluateDecisionsApiResponse>(
        '/api/decisions/evaluate',
        context
    );
    return response.decisions;
}
