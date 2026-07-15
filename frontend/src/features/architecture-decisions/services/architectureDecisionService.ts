import {
    ArchitectureDecision,
    ArchitectureDecisionListItem,
    architectureDecisionApiResponseSchema,
    architectureDecisionListApiResponseSchema,
    GenerateArchitectureDecisionRequest,
} from '@/domain/architectureDecision';
import {getJson, HttpClientError, postJson} from '@/shared/api/httpClient';
import {
    getArchitectureDecisionById,
    saveArchitectureDecision,
} from '@/features/architecture-decisions/services/architectureDecisionStorage';

export async function generateArchitectureDecision(
    request: GenerateArchitectureDecisionRequest,
    signal?: AbortSignal
): Promise<ArchitectureDecision> {
    const response = await postJson(
        '/api/architecture-decisions/generate',
        request,
        architectureDecisionApiResponseSchema,
        {signal}
    );

    saveArchitectureDecision(response.architectureDecision);
    return response.architectureDecision;
}

export async function fetchArchitectureDecisions(
    signal?: AbortSignal
): Promise<ArchitectureDecisionListItem[]> {
    const response = await getJson(
        '/api/architecture-decisions',
        architectureDecisionListApiResponseSchema,
        {signal}
    );

    return response?.architectureDecisions ?? [];
}

export async function fetchArchitectureDecisionById(decisionId: string): Promise<ArchitectureDecision> {
    const response = await getJson(
        `/api/architecture-decisions/${decisionId}`,
        architectureDecisionApiResponseSchema
    );

    if (response?.architectureDecision) {
        saveArchitectureDecision(response.architectureDecision);
        return response.architectureDecision;
    }

    const cachedDecision = getArchitectureDecisionById(decisionId);
    if (cachedDecision) {
        return cachedDecision;
    }

    throw new HttpClientError('Architecture decision not found', 404);
}
