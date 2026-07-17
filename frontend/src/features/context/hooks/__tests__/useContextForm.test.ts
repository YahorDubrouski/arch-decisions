import {describe, expect, it} from 'vitest';
import {act, renderHook} from '@testing-library/react';
import {useContextForm} from '../useContextForm';
import {ProjectContext} from '@/domain/context';

describe('useContextForm', () => {
    it('initializes with empty context', () => {
        // Arrange
        // (fresh form hook)

        // Act
        const {result} = renderHook(() => useContextForm());

        // Assert
        expect(result.current.context).toEqual({});
        expect(result.current.currentStep).toBe(1);
        expect(result.current.errors).toEqual({});
        expect(result.current.canSubmit).toBe(false);
    });

    it('when a context field is updated then form state includes that field', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());

        // Act
        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        // Assert
        expect(result.current.context.teamSize).toBe('6-20');
        expect(result.current.errors).toEqual({});
    });

    it('merges partial updates with existing context', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        // Act
        act(() => {
            result.current.updateContext({trafficPattern: 'variable'});
        });

        // Assert
        expect(result.current.context.teamSize).toBe('6-20');
        expect(result.current.context.trafficPattern).toBe('variable');
    });

    /**
     * Given
     * - All required context fields are filled.
     * When
     * - The user advances to the next step.
     * Then
     * - The wizard moves to step 2 with no validation errors.
     */
    it('moves to next step when context is valid', () => {
        // Arrange
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

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(2);
        expect(result.current.errors).toEqual({});
    });

    it('moves to next step when only current step fields are filled', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(2);
        expect(result.current.errors).toEqual({});
    });

    /**
     * Given
     * - Step 1 is active and team size is missing.
     * When
     * - The user tries to advance.
     * Then
     * - The wizard stays on step 1 and shows a team size error.
     */
    it('shows error when trying to move to next step with invalid context', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(1);
        expect(result.current.errors.teamSize).toBe('Please select team size');
    });

    it('moves from step 2 to step 3 when traffic pattern is filled', () => {
        // Arrange
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

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(3);
        expect(result.current.errors).toEqual({});
    });

    /**
     * Given
     * - Step 2 is active and traffic pattern is missing.
     * When
     * - The user tries to advance.
     * Then
     * - The wizard stays on step 2 and shows a traffic pattern error.
     */
    it('shows error on step 2 when traffic pattern is missing', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        act(() => {
            result.current.updateContext({teamSize: '6-20'});
        });
        act(() => {
            result.current.nextStep();
        });

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(2);
        expect(result.current.errors.trafficPattern).toBe('Please select traffic pattern');
    });

    it('moves from step 3 to step 4 when budget sensitivity is filled', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        act(() => {
            result.current.updateContext({
                teamSize: '6-20',
                trafficPattern: 'variable',
            });
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.updateContext({budgetSensitivity: 'balanced'});
        });

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(4);
        expect(result.current.errors).toEqual({});
    });

    /**
     * Given
     * - Step 4 is active and no compliance requirement is selected.
     * When
     * - The user tries to advance.
     * Then
     * - The wizard stays on step 4 and shows a compliance error.
     */
    it('shows error on step 4 when no compliance requirement is selected', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        act(() => {
            result.current.updateContext({
                teamSize: '6-20',
                trafficPattern: 'variable',
                budgetSensitivity: 'balanced',
            });
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(4);
        expect(result.current.errors.complianceRequirements).toBe(
            'Please select at least one compliance requirement'
        );
    });

    it('moves from step 4 to step 5 when compliance requirements are selected', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        act(() => {
            result.current.updateContext({
                teamSize: '6-20',
                trafficPattern: 'variable',
                budgetSensitivity: 'balanced',
            });
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.updateContext({complianceRequirements: ['SOC2']});
        });

        // Act
        act(() => {
            result.current.nextStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(5);
        expect(result.current.errors).toEqual({});
    });

    /**
     * Given
     * - The user is on step 5 with all prior fields filled.
     * When
     * - Operational maturity is selected.
     * Then
     * - Submit becomes enabled.
     */
    it('enables submit on step 5 when operational maturity is filled', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        act(() => {
            result.current.updateContext({
                teamSize: '6-20',
                trafficPattern: 'variable',
                budgetSensitivity: 'balanced',
                complianceRequirements: ['SOC2'],
            });
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });
        act(() => {
            result.current.nextStep();
        });
        expect(result.current.canSubmit).toBe(false);

        // Act
        act(() => {
            result.current.updateContext({operationalMaturity: 'moderate'});
        });

        // Assert
        expect(result.current.canSubmit).toBe(true);
    });

    it('moves to previous step', () => {
        // Arrange
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

        // Act
        act(() => {
            result.current.previousStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(1);
    });

    it('does not go below step 1', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());

        // Act
        act(() => {
            result.current.previousStep();
        });

        // Assert
        expect(result.current.currentStep).toBe(1);
    });

    it('does not go above step 5', () => {
        // Arrange
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

        // Act
        for (let i = 0; i < 5; i++) {
            act(() => {
                result.current.nextStep();
            });
        }

        // Assert
        expect(result.current.currentStep).toBe(5);
    });

    it('canSubmit returns true when context is complete', () => {
        // Arrange
        const {result} = renderHook(() => useContextForm());
        const completeContext: Partial<ProjectContext> = {
            teamSize: '6-20',
            trafficPattern: 'variable',
            budgetSensitivity: 'balanced',
            complianceRequirements: ['SOC2'],
            operationalMaturity: 'moderate',
        };

        // Act
        act(() => {
            result.current.updateContext(completeContext);
        });

        // Assert
        expect(result.current.canSubmit).toBe(true);
    });
});
