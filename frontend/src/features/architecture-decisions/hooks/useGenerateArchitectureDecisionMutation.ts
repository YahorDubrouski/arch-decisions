import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {GenerateArchitectureDecisionRequest} from '@/domain/architectureDecision';
import {generateArchitectureDecision} from '@/features/architecture-decisions/services/architectureDecisionService';
import {resolveSubmitError} from '@/shared/api/httpClient';

export function useGenerateArchitectureDecisionMutation() {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (request: GenerateArchitectureDecisionRequest) => generateArchitectureDecision(request),
        onSuccess: (architectureDecision) => {
            navigate(`/architecture-decisions/${architectureDecision.id}`);
        },
    });

    function submit(request: GenerateArchitectureDecisionRequest): void {
        mutation.mutate(request);
    }

    const submitError = mutation.error ? resolveSubmitError(mutation.error) : null;

    return {
        submit,
        isSubmitting: mutation.isPending,
        submitError,
        resetSubmitError: mutation.reset,
    };
}
