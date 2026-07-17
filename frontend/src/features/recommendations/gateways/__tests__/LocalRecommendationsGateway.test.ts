import {describe, expect, it} from 'vitest';
import {createLocalRecommendationsGateway} from '../LocalRecommendationsGateway';

describe('createLocalRecommendationsGateway', () => {
    /**
     * Given
     * - A local recommendations gateway and an already-aborted abort signal.
     * When
     * - Recommendations are evaluated with that signal.
     * Then
     * - The request rejects with an AbortError.
     */
    it('rejects when the signal is already aborted', async () => {
        // Arrange
        const gateway = createLocalRecommendationsGateway();
        const controller = new AbortController();
        controller.abort();

        // Act & Assert
        await expect(
            gateway.evaluateAll(
                {
                    teamSize: '6-20',
                    trafficPattern: 'variable',
                    budgetSensitivity: 'balanced',
                    complianceRequirements: [],
                    operationalMaturity: 'moderate',
                },
                controller.signal
            )
        ).rejects.toMatchObject({name: 'AbortError'});
    });
});
