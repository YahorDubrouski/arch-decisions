import {afterEach, describe, expect, it, vi} from 'vitest';
import {createRecommendationsGateway} from '../createRecommendationsGateway';

describe('createRecommendationsGateway', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    /**
     * Given
     * - VITE_DATA_SOURCE is configured as http.
     * When
     * - The recommendations gateway is created.
     * Then
     * - An http adapter with evaluateAll is returned.
     */
    it('returns the http adapter when VITE_DATA_SOURCE is http', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'http');

        // Act
        const gateway = createRecommendationsGateway();

        // Assert
        expect(gateway.evaluateAll).toEqual(expect.any(Function));
    });

    /**
     * Given
     * - VITE_DATA_SOURCE is configured as local.
     * When
     * - Recommendations are evaluated for a small cost-optimized team.
     * Then
     * - Local rules recommend EC2 and GitHub Actions.
     */
    it('returns the local adapter when VITE_DATA_SOURCE is local', async () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'local');
        const gateway = createRecommendationsGateway();

        // Act
        const recommendations = await gateway.evaluateAll({
            teamSize: '1-5',
            trafficPattern: 'low-steady',
            budgetSensitivity: 'cost-optimized',
            complianceRequirements: [],
            operationalMaturity: 'minimal',
        });

        // Assert
        expect(recommendations.compute.recommended).toBe('EC2');
        expect(recommendations.cicd.recommended).toBe('GitHub Actions');
    });
});
