import {useState} from 'react';
import {
    isContextComplete,
    isStepValid,
    ProjectContext,
    validateStep,
} from '@/domain/context';

export function useContextForm() {
    const [context, setContext] = useState<Partial<ProjectContext>>({});
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function updateContext(updates: Partial<ProjectContext>) {
        setContext((prev) => ({...prev, ...updates}));
        setErrors({});
    }

    function nextStep() {
        if (isStepValid(currentStep, context)) {
            setCurrentStep((prev) => Math.min(prev + 1, 5));
            setErrors({});
        } else {
            setErrors(validateStep(currentStep, context));
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
