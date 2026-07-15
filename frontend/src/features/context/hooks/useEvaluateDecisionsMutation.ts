import {useRef} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {ProjectContext} from '@/domain/context';
import {evaluateDecisions} from '@/features/context/services/decisionsService';
import {saveProjectContext} from '@/features/context/services/contextStorage';
import {saveDecisions} from '@/features/decisions/services/decisionsStorage';
import {isAbortError, resolveSubmitError} from '@/shared/api/httpClient';

export function useEvaluateDecisionsMutation() {
    const navigate = useNavigate();
    const abortControllerRef = useRef<AbortController | null>(null);

    const mutation = useMutation({
        mutationFn: (context: ProjectContext) => {
            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;
            return evaluateDecisions(context, controller.signal);
        },
        onSuccess: (decisions, context) => {
            saveProjectContext(context);
            saveDecisions(decisions);
            navigate('/decisions');
        },
        onSettled: () => {
            abortControllerRef.current = null;
        },
    });

    function submit(context: ProjectContext): void {
        mutation.mutate(context);
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
