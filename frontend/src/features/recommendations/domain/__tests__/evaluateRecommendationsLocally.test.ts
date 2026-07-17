import {describe, expect, it} from 'vitest';
import type {ProjectContext} from '@/domain/context';
import {evaluateRecommendationsLocally} from '../evaluateRecommendationsLocally';

const baseContext: ProjectContext = {
    teamSize: '6-20',
    trafficPattern: 'variable',
    budgetSensitivity: 'balanced',
    complianceRequirements: [],
    operationalMaturity: 'moderate',
};

describe('evaluateRecommendationsLocally', () => {
    /**
     * Given
     * - Team size is 1-5 and budget is cost-optimized.
     * When
     * - Recommendations are evaluated locally.
     * Then
     * - Compute is EC2 with cost-oriented secrets and CI/CD choices.
     */
    it('recommends EC2 for small cost-optimized teams', () => {
        // Arrange
        const context: ProjectContext = {
            ...baseContext,
            teamSize: '1-5',
            budgetSensitivity: 'cost-optimized',
        };

        // Act
        const result = evaluateRecommendationsLocally(context);

        // Assert
        expect(result.compute.recommended).toBe('EC2');
        expect(result.cicd.recommended).toBe('GitHub Actions');
        expect(result.secrets.recommended).toBe('AWS Parameter Store');
    });

    /**
     * Given
     * - Team size is 21-50 with high-spike traffic.
     * When
     * - Recommendations are evaluated locally.
     * Then
     * - Compute recommendation is EKS.
     */
    it('recommends EKS for mid-size high-spike traffic', () => {
        // Arrange
        const context: ProjectContext = {
            ...baseContext,
            teamSize: '21-50',
            trafficPattern: 'high-spike',
        };

        // Act
        const result = evaluateRecommendationsLocally(context);

        // Assert
        expect(result.compute.recommended).toBe('EKS');
    });

    /**
     * Given
     * - Compliance requirements include SOC2.
     * When
     * - Recommendations are evaluated locally.
     * Then
     * - Secrets Manager is recommended with low risk trade-offs.
     */
    it('recommends Secrets Manager when compliance is required', () => {
        // Arrange
        const context: ProjectContext = {
            ...baseContext,
            complianceRequirements: ['SOC2'],
        };

        // Act
        const result = evaluateRecommendationsLocally(context);

        // Assert
        expect(result.secrets.recommended).toBe('AWS Secrets Manager');
        expect(result.secrets.tradeOffs.risk).toBe('low');
    });

    /**
     * Given
     * - A balanced default project profile.
     * When
     * - Recommendations are evaluated locally.
     * Then
     * - Compute defaults to ECS and CI/CD to GitLab CI.
     */
    it('defaults compute to ECS for balanced profiles', () => {
        // Arrange
        // (baseContext fixture)

        // Act
        const result = evaluateRecommendationsLocally(baseContext);

        // Assert
        expect(result.compute.recommended).toBe('ECS');
        expect(result.cicd.recommended).toBe('GitLab CI');
    });
});
