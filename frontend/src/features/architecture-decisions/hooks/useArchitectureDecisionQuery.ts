import {useQuery} from '@tanstack/react-query';
import {architectureDecisionGateway} from '@/features/architecture-decisions/gateways/architectureDecisionGateway';

export function useArchitectureDecisionQuery(decisionId: string | undefined) {
    return useQuery({
        queryKey: ['architecture-decision', decisionId],
        queryFn: () => architectureDecisionGateway.getById(decisionId!),
        enabled: Boolean(decisionId),
    });
}
