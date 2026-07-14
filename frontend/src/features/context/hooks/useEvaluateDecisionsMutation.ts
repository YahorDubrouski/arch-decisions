import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {ProjectContext} from '@/domain/context';
import {evaluateDecisions} from '@/features/context/services/decisionsService';
import {saveDecisions} from '@/features/decisions/services/decisionsStorage';
import {resolveSubmitError} from '@/shared/api/httpClient';

export function useEvaluateDecisionsMutation() {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (context: ProjectContext) => evaluateDecisions(context),
        onSuccess: (decisions) => {
            saveDecisions(decisions);
            navigate('/decisions');
        },
    });

    function submit(context: ProjectContext): void {
        mutation.mutate(context);
    }

    const submitError = mutation.error ? resolveSubmitError(mutation.error) : null;

    return {
        submit,
        isSubmitting: mutation.isPending,
        submitError,
        resetSubmitError: mutation.reset,
    };
}
