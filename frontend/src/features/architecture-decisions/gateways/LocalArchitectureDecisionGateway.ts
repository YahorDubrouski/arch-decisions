import type {
    ArchitectureDecision,
    ArchitectureDecisionListItem,
    GenerateArchitectureDecisionRequest,
} from '@/domain/architectureDecision';
import {matchesArchitectureDecisionListFilters} from '@/domain/architectureDecisionFilters';
import {HttpClientError} from '@/shared/api/httpClient';
import {buildArchitectureDecisionDraft} from '@/features/architecture-decisions/domain/buildArchitectureDecisionDraft';
import {seedArchitectureDecisionsIfEmpty} from '@/features/architecture-decisions/seed/seedArchitectureDecisionsIfEmpty';
import {
    getArchitectureDecisionById,
    listArchitectureDecisionItems,
    saveArchitectureDecision,
} from '@/features/architecture-decisions/services/architectureDecisionStorage';
import type {
    ArchitectureDecisionGateway,
    ArchitectureDecisionListFilters,
} from './architectureDecisionGateway.port';

function assertNotAborted(signal?: AbortSignal): void {
    if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
    }
}

export function createLocalArchitectureDecisionGateway(): ArchitectureDecisionGateway {
    return {
        async generate(
            request: GenerateArchitectureDecisionRequest,
            signal?: AbortSignal
        ): Promise<ArchitectureDecision> {
            assertNotAborted(signal);
            const draft = buildArchitectureDecisionDraft(request.context, request.recommendations);
            assertNotAborted(signal);

            const architectureDecision: ArchitectureDecision = {
                id: crypto.randomUUID(),
                title: draft.title,
                status: draft.status,
                content: draft.content,
                summary: draft.summary,
                createdAt: new Date().toISOString(),
            };

            saveArchitectureDecision(architectureDecision);
            return architectureDecision;
        },

        async list(
            filters: ArchitectureDecisionListFilters = {},
            signal?: AbortSignal
        ): Promise<ArchitectureDecisionListItem[]> {
            assertNotAborted(signal);
            seedArchitectureDecisionsIfEmpty();
            assertNotAborted(signal);

            return listArchitectureDecisionItems().filter((item) =>
                matchesArchitectureDecisionListFilters(item, filters)
            );
        },

        async getById(decisionId: string, signal?: AbortSignal): Promise<ArchitectureDecision> {
            assertNotAborted(signal);
            seedArchitectureDecisionsIfEmpty();
            assertNotAborted(signal);

            const architectureDecision = getArchitectureDecisionById(decisionId);
            if (!architectureDecision) {
                throw new HttpClientError('Architecture decision not found', 404);
            }

            return architectureDecision;
        },
    };
}
