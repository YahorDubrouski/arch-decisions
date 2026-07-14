import {describe, expect, it} from 'vitest';
import {act, renderHook} from '@testing-library/react';
import {useContextForm} from '../useContextForm';
import {ProjectContext} from '@/domain/context';

describe('useContextForm', () => {
    it('initializes with empty context', () => {
        const {result} = renderHook(() => useContextForm());

        expect(result.current.context).toEqual({});
        expect(result.current.currentStep).toBe(1);
        expect(result.current.errors).toEqual({});
        expect(result.current.canSubmit).toBe(false);
    });

    it('updates context with updateContext', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        expect(result.current.context.teamSize).toBe('6-20');
        expect(result.current.errors).toEqual({});
    });

    it('merges partial updates with existing context', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        act(() => {
            result.current.updateContext({trafficPattern: 'variable'});
        });

        expect(result.current.context.teamSize).toBe('6-20');
        expect(result.current.context.trafficPattern).toBe('variable');
    });

    it('moves to next step when context is valid', () => {
        const {result} = renderHook(() => useContextForm());

        const completeContext: Partial<ProjectContext> = {
            teamSize: '6-20',
            trafficPattern: 'variable',
            budgetSensitivity: 'balanced',
            complianceRequirements: ['SOC2'],
            operationalMaturity: 'moderate',
        };

        act(() => {
            result.current.updateContext(completeContext);
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(2);
        expect(result.current.errors).toEqual({});
    });

    it('moves to next step when only current step fields are filled', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(2);
        expect(result.current.errors).toEqual({});
    });

    it('shows error when trying to move to next step with invalid context', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(1);
        expect(result.current.errors.form).toBe('Please complete all required fields');
    });

    it('moves from step 2 to step 3 when traffic pattern is filled', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        act(() => {
            result.current.nextStep();
        });

        act(() => {
            result.current.updateContext({trafficPattern: 'variable'});
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(3);
        expect(result.current.errors).toEqual({});
    });

    it('shows error on step 2 when traffic pattern is missing', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        act(() => {
            result.current.nextStep();
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(2);
        expect(result.current.errors.form).toBe('Please complete all required fields');
    });

    it('moves to previous step', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.updateContext({
                teamSize: '6-20',
                trafficPattern: 'variable',
                budgetSensitivity: 'balanced',
                complianceRequirements: ['SOC2'],
                operationalMaturity: 'moderate',
            });
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(2);

        act(() => {
            result.current.previousStep();
        });

        expect(result.current.currentStep).toBe(1);
    });

    it('does not go below step 1', () => {
        const {result} = renderHook(() => useContextForm());

        act(() => {
            result.current.previousStep();
        });

        expect(result.current.currentStep).toBe(1);
    });

    it('does not go above step 5', () => {
        const {result} = renderHook(() => useContextForm());

        const completeContext: Partial<ProjectContext> = {
            teamSize: '6-20',
            trafficPattern: 'variable',
            budgetSensitivity: 'balanced',
            complianceRequirements: ['SOC2'],
            operationalMaturity: 'moderate',
        };

        act(() => {
            result.current.updateContext(completeContext);
        });

        for (let i = 0; i < 5; i++) {
            act(() => {
                result.current.nextStep();
            });
        }

        expect(result.current.currentStep).toBe(5);
    });

    it('canSubmit returns true when context is complete', () => {
        const {result} = renderHook(() => useContextForm());

        const completeContext: Partial<ProjectContext> = {
            teamSize: '6-20',
            trafficPattern: 'variable',
            budgetSensitivity: 'balanced',
            complianceRequirements: ['SOC2'],
            operationalMaturity: 'moderate',
        };

        act(() => {
            result.current.updateContext(completeContext);
        });

        expect(result.current.canSubmit).toBe(true);
    });
});
