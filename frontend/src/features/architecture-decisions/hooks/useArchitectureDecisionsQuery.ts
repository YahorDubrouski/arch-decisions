import {useQuery} from '@tanstack/react-query';
import type {ArchitectureDecisionListFilters} from '@/features/architecture-decisions/domain/listFilters';
import {architectureDecisionGateway} from '@/features/architecture-decisions/gateways/architectureDecisionGateway';

export function useArchitectureDecisionsQuery(filters: ArchitectureDecisionListFilters) {
    const listFilters = {
        search: filters.search,
        status: filters.status,
    };

    return useQuery({
        queryKey: ['architecture-decisions', listFilters],
        queryFn: ({signal}) => architectureDecisionGateway.list(listFilters, signal),
    });
}
