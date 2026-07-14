import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {isContextComplete} from '@/domain/context';
import {useContextForm} from '@/features/context/hooks/useContextForm';
import {Step1TeamSize} from '@/features/context/components/Step1TeamSize';
import {Step2TrafficPattern} from '@/features/context/components/Step2TrafficPattern';
import {Step3BudgetSensitivity} from '@/features/context/components/Step3BudgetSensitivity';
import {Step4ComplianceRequirements} from '@/features/context/components/Step4ComplianceRequirements';
import {Step5OperationalMaturity} from '@/features/context/components/Step5OperationalMaturity';
import {evaluateDecisions} from '@/features/context/services/decisionsService';
import {saveDecisions} from '@/features/decisions/services/decisionsStorage';
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
            const decisions = await evaluateDecisions(context);
            saveDecisions(decisions);
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
