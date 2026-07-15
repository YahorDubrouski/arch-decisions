import {useRef} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {GenerateArchitectureDecisionRequest} from '@/domain/architectureDecision';
import {generateArchitectureDecision} from '@/features/architecture-decisions/services/architectureDecisionService';
import {isAbortError, resolveSubmitError} from '@/shared/api/httpClient';

export function useGenerateArchitectureDecisionMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);

    const mutation = useMutation({
        mutationFn: (request: GenerateArchitectureDecisionRequest) => {
            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;
            return generateArchitectureDecision(request, controller.signal);
        },
        onSuccess: (architectureDecision) => {
            void queryClient.invalidateQueries({queryKey: ['architecture-decisions']});
            navigate(`/architecture-decisions/${architectureDecision.id}`);
        },
        onSettled: () => {
            abortControllerRef.current = null;
        },
    });

    function submit(request: GenerateArchitectureDecisionRequest): void {
        mutation.mutate(request);
    }

    function cancel(): void {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        mutation.reset();
    }

    const submitError =
        mutation.error && !isAbortError(mutation.error)
            ? resolveSubmitError(mutation.error)
            : null;

    return {
        submit,
        cancel,
        isSubmitting: mutation.isPending,
        submitError,
        resetSubmitError: mutation.reset,
    };
}
