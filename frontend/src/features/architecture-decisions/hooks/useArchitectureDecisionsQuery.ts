import {useQuery} from '@tanstack/react-query';
import {fetchArchitectureDecisions} from '@/features/architecture-decisions/services/architectureDecisionService';

export function useArchitectureDecisionsQuery() {
    return useQuery({
        queryKey: ['architecture-decisions'],
        queryFn: ({signal}) => fetchArchitectureDecisions(signal),
    });
}
