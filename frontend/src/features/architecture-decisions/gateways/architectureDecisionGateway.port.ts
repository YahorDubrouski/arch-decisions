import type {
    ArchitectureDecision,
    ArchitectureDecisionListItem,
    GenerateArchitectureDecisionRequest,
} from '@/domain/architectureDecision';

export type ArchitectureDecisionListFilters = {
    search?: string;
    status?: string;
};

export type ArchitectureDecisionGateway = {
    generate(
        request: GenerateArchitectureDecisionRequest,
        signal?: AbortSignal
    ): Promise<ArchitectureDecision>;
    list(
        filters?: ArchitectureDecisionListFilters,
        signal?: AbortSignal
    ): Promise<ArchitectureDecisionListItem[]>;
    getById(decisionId: string, signal?: AbortSignal): Promise<ArchitectureDecision>;
};
