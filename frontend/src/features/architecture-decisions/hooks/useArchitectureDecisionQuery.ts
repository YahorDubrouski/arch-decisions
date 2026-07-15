import {useQuery} from '@tanstack/react-query';
import {fetchArchitectureDecisionById} from '@/features/architecture-decisions/services/architectureDecisionService';

export function useArchitectureDecisionQuery(decisionId: string | undefined) {
    return useQuery({
        queryKey: ['architecture-decision', decisionId],
        queryFn: () => fetchArchitectureDecisionById(decisionId!),
        enabled: Boolean(decisionId),
    });
}
