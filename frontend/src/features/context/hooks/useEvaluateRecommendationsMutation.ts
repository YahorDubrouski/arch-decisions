import {useRef} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {ProjectContext} from '@/domain/context';
import {recommendationsGateway} from '@/features/recommendations/gateways/recommendationsGateway';
import {saveProjectContext} from '@/features/context/services/contextStorage';
import {saveRecommendations} from '@/features/recommendations/services/recommendationsStorage';
import {isAbortError, resolveSubmitError} from '@/shared/api/httpClient';

export function useEvaluateRecommendationsMutation() {
    const navigate = useNavigate();
    const abortControllerRef = useRef<AbortController | null>(null);

    const mutation = useMutation({
        mutationFn: (context: ProjectContext) => {
            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;
            return recommendationsGateway.evaluateAll(context, controller.signal);
        },
        onSuccess: (recommendations, context) => {
            saveProjectContext(context);
            saveRecommendations(recommendations);
            navigate('/recommendations');
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
