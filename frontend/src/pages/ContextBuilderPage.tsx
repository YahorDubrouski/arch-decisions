import {FormEvent} from 'react';
import {isContextComplete} from '@/domain/context';
import {useContextForm} from '@/features/context/hooks/useContextForm';
import {useEvaluateDecisionsMutation} from '@/features/context/hooks/useEvaluateDecisionsMutation';
import {Step1TeamSize} from '@/features/context/components/Step1TeamSize';
import {Step2TrafficPattern} from '@/features/context/components/Step2TrafficPattern';
import {Step3BudgetSensitivity} from '@/features/context/components/Step3BudgetSensitivity';
import {Step4ComplianceRequirements} from '@/features/context/components/Step4ComplianceRequirements';
import {Step5OperationalMaturity} from '@/features/context/components/Step5OperationalMaturity';
import {StepProgress} from '@/features/context/components/StepProgress';
import {ErrorState} from '@/shared/ui/ErrorState';
import {ContextIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './ContextBuilderPage.module.css';

const STEP_LABELS = [
    'Team size',
    'Traffic pattern',
    'Budget sensitivity',
    'Compliance',
    'Operational maturity',
] as const;

export function ContextBuilderPage() {
    const {context, updateContext, currentStep, nextStep, previousStep, errors, canSubmit} =
        useContextForm();
    const {submit, cancel, isSubmitting, submitError, resetSubmitError} =
        useEvaluateDecisionsMutation();

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
        <div className={`${ui.pagePanel} ${styles.page}`}>
            <header className={styles.pageHeader}>
                <span className={ui.pageIconWrap}>
                    <ContextIcon size={22}/>
                </span>
                <div>
                    <h1 className={ui.pageTitle}>Project context</h1>
                    <p className={ui.pageLead}>
                        Define constraints that drive compute, security, and delivery recommendations.
                    </p>
                </div>
            </header>

            <StepProgress
                currentStep={currentStep}
                totalSteps={5}
                label={STEP_LABELS[currentStep - 1]}
            />

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
                        <button type="button" className={ui.btnSecondary} onClick={previousStep} disabled={isSubmitting}>
                            Back
                        </button>
                    )}
                    {currentStep < 5 ? (
                        <button type="submit" className={ui.btnPrimary}>
                            Next
                        </button>
                    ) : (
                        <>
                            <button type="submit" className={ui.btnPrimary} disabled={!canSubmit || isSubmitting}>
                                {isSubmitting ? 'Submitting…' : 'Evaluate decisions'}
                            </button>
                            {isSubmitting && (
                                <button type="button" className={ui.btnGhost} onClick={cancel}>
                                    Cancel
                                </button>
                            )}
                        </>
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
