import type {
    ArchitectureDecision,
    ArchitectureDecisionListItem,
    GenerateArchitectureDecisionRequest,
} from '@/domain/architectureDecision';
import {
    architectureDecisionApiResponseSchema,
    architectureDecisionListApiResponseSchema,
} from '@/domain/architectureDecision';
import {enqueueAndWaitForJobResult} from '@/shared/api/enqueueAndWaitForJobResult';
import {getJson, HttpClientError} from '@/shared/api/httpClient';
import {
    getArchitectureDecisionById,
    saveArchitectureDecision,
} from '@/features/architecture-decisions/services/architectureDecisionStorage';
import type {
    ArchitectureDecisionGateway,
    ArchitectureDecisionListFilters,
} from './architectureDecisionGateway.port';

export function createHttpArchitectureDecisionGateway(): ArchitectureDecisionGateway {
    return {
        async generate(
            request: GenerateArchitectureDecisionRequest,
            signal?: AbortSignal
        ): Promise<ArchitectureDecision> {
            const result = await enqueueAndWaitForJobResult(
                '/api/architecture-decisions/generate',
                request,
                architectureDecisionApiResponseSchema,
                signal
            );

            saveArchitectureDecision(result.architectureDecision);
            return result.architectureDecision;
        },

        async list(
            filters: ArchitectureDecisionListFilters = {},
            signal?: AbortSignal
        ): Promise<ArchitectureDecisionListItem[]> {
            const params = new URLSearchParams();

            if (filters.search?.trim()) {
                params.set('search', filters.search.trim());
            }

            if (filters.status) {
                params.set('status', filters.status);
            }

            const query = params.toString();
            const path = query ? `/api/architecture-decisions?${query}` : '/api/architecture-decisions';
            const response = await getJson(path, architectureDecisionListApiResponseSchema, {signal});

            return response?.architectureDecisions ?? [];
        },

        async getById(decisionId: string): Promise<ArchitectureDecision> {
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
        },
    };
}
