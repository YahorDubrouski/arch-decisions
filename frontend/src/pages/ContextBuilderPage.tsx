import {FormEvent} from 'react';
import {isContextComplete} from '@/domain/context';
import {useContextForm} from '@/features/context/hooks/useContextForm';
import {useEvaluateDecisionsMutation} from '@/features/context/hooks/useEvaluateDecisionsMutation';
import {Step1TeamSize} from '@/features/context/components/Step1TeamSize';
import {Step2TrafficPattern} from '@/features/context/components/Step2TrafficPattern';
import {Step3BudgetSensitivity} from '@/features/context/components/Step3BudgetSensitivity';
import {Step4ComplianceRequirements} from '@/features/context/components/Step4ComplianceRequirements';
import {Step5OperationalMaturity} from '@/features/context/components/Step5OperationalMaturity';
import {ErrorState} from '@/shared/ui/ErrorState';
import styles from './ContextBuilderPage.module.css';

export function ContextBuilderPage() {
    const {context, updateContext, currentStep, nextStep, previousStep, errors, canSubmit} =
        useContextForm();
    const {submit, isSubmitting, submitError, resetSubmitError} = useEvaluateDecisionsMutation();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (currentStep < 5) {
            nextStep();
            return;
        }

        if (!isContextComplete(context) || isSubmitting) {
            return;
        }

        resetSubmitError();
        submit(context);
    }

    return (
        <div className={styles.page}>
            <h1>Project Context Builder</h1>
            <div className={styles.stepIndicator}>Step {currentStep} of 5</div>

            <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
                {currentStep === 1 && (
                    <Step1TeamSize
                        value={context.teamSize ?? null}
                        onChange={(teamSize) => updateContext({teamSize})}
                        error={errors.teamSize}
                    />
                )}

                {currentStep === 2 && (
                    <Step2TrafficPattern
                        value={context.trafficPattern ?? null}
                        onChange={(trafficPattern) => updateContext({trafficPattern})}
                        error={errors.trafficPattern}
                    />
                )}

                {currentStep === 3 && (
                    <Step3BudgetSensitivity
                        value={context.budgetSensitivity ?? null}
                        onChange={(budgetSensitivity) => updateContext({budgetSensitivity})}
                        error={errors.budgetSensitivity}
                    />
                )}

                {currentStep === 4 && (
                    <Step4ComplianceRequirements
                        value={context.complianceRequirements ?? []}
                        onChange={(complianceRequirements) => updateContext({complianceRequirements})}
                        error={errors.complianceRequirements}
                    />
                )}

                {currentStep === 5 && (
                    <Step5OperationalMaturity
                        value={context.operationalMaturity ?? null}
                        onChange={(operationalMaturity) => updateContext({operationalMaturity})}
                        error={errors.operationalMaturity}
                    />
                )}

                <div className={styles.navigation}>
                    {currentStep > 1 && (
                        <button type="button" onClick={previousStep} disabled={isSubmitting}>
                            Back
                        </button>
                    )}
                    {currentStep < 5 ? (
                        <button type="submit">Next</button>
                    ) : (
                        <button type="submit" disabled={!canSubmit || isSubmitting}>
                            {isSubmitting ? 'Submitting…' : 'Submit'}
                        </button>
                    )}
                </div>
            </form>

            {submitError && (
                <ErrorState
                    message={submitError}
                    onRetry={() => {
                        if (isContextComplete(context)) {
                            resetSubmitError();
                            submit(context);
                        }
                    }}
                />
            )}
        </div>
    );
}
