import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {isContextComplete} from '@/domain/context';
import {useContextForm} from '@/features/context/hooks/useContextForm';
import {Step1TeamSize} from '@/features/context/components/Step1TeamSize';
import {evaluateDecisions} from '@/features/context/services/decisionsService';
import styles from './ContextBuilderPage.module.css';

export function ContextBuilderPage() {
    const {context, updateContext, currentStep, nextStep, previousStep, errors, canSubmit} =
        useContextForm();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);

    async function handleSubmit() {
        if (!isContextComplete(context)) {
            return;
        }

        setSubmitError(null);

        try {
            await evaluateDecisions(context);
            navigate('/decisions');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to submit context';
            setSubmitError(message);
        }
    }

    return (
        <div className={styles.page}>
            <h1>Project Context Builder</h1>
            <div className={styles.stepIndicator}>Step {currentStep} of 5</div>

            {currentStep === 1 && (
                <Step1TeamSize
                    value={context.teamSize ?? null}
                    onChange={(teamSize) => updateContext({teamSize})}
                    error={errors.teamSize}
                />
            )}

            <div className={styles.navigation}>
                {currentStep > 1 && (
                    <button type="button" onClick={previousStep}>
                        Back
                    </button>
                )}
                {currentStep < 5 ? (
                    <button type="button" onClick={nextStep}>
                        Next
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} disabled={!canSubmit}>
                        Submit
                    </button>
                )}
            </div>

            {errors.form && <div className={styles.formError}>{errors.form}</div>}
            {submitError && <div className={styles.formError}>{submitError}</div>}
        </div>
    );
}
