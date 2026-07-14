import {useState} from 'react';
import {isContextComplete, ProjectContext} from '@/domain/context';

function validateStep(step: number, context: Partial<ProjectContext>): boolean {
    switch (step) {
        case 1:
            return context.teamSize !== undefined;
        case 2:
            return context.trafficPattern !== undefined;
        case 3:
            return context.budgetSensitivity !== undefined;
        case 4:
            return (
                Array.isArray(context.complianceRequirements) &&
                context.complianceRequirements.length > 0
            );
        case 5:
            return context.operationalMaturity !== undefined;
        default:
            return false;
    }
}

export function useContextForm() {
    const [context, setContext] = useState<Partial<ProjectContext>>({});
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function updateContext(updates: Partial<ProjectContext>) {
        setContext((prev) => ({...prev, ...updates}));
        setErrors({});
    }

    function nextStep() {
        if (validateStep(currentStep, context)) {
            setCurrentStep((prev) => Math.min(prev + 1, 5));
            setErrors({});
        } else {
            setErrors({form: 'Please complete all required fields'});
        }
    }

    function previousStep() {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        setErrors({});
    }

    const canSubmit = isContextComplete(context);

    return {
        context,
        updateContext,
        currentStep,
        nextStep,
        previousStep,
        errors,
        canSubmit,
    };
}
