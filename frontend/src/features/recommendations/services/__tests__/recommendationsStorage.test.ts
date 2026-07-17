import {afterEach, describe, expect, it} from 'vitest';
import {RecommendationsResponse} from '@/domain/recommendations';
import {clearRecommendations, getRecommendations, saveRecommendations} from '../recommendationsStorage';

const sampleRecommendations: RecommendationsResponse = {
    compute: {
        category: 'compute',
        recommended: 'ECS',
        alternatives: ['EC2', 'Lambda'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'medium',
        },
    },
    secrets: {
        category: 'secrets',
        recommended: 'AWS Secrets Manager',
        alternatives: ['HashiCorp Vault'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
    cicd: {
        category: 'cicd',
        recommended: 'GitHub Actions',
        alternatives: ['GitLab CI'],
        tradeOffs: {
            cost: 'low',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
};

describe('recommendationsStorage', () => {
    afterEach(() => {
        clearRecommendations();
    });

    it('returns null when no recommendations are stored', () => {
        // Arrange
        // (no stored recommendations)

        // Act
        const result = getRecommendations();

        // Assert
        expect(result).toBeNull();
    });

    it('saves and reads recommendations from sessionStorage', () => {
        // Arrange
        // (sample recommendations payload)

        // Act
        saveRecommendations(sampleRecommendations);
        const result = getRecommendations();

        // Assert
        expect(result).toEqual(sampleRecommendations);
    });

    it('clears stored recommendations', () => {
        // Arrange
        saveRecommendations(sampleRecommendations);

        // Act
        clearRecommendations();
        const result = getRecommendations();

        // Assert
        expect(result).toBeNull();
    });

    it('returns null when stored value is invalid JSON', () => {
        // Arrange
        sessionStorage.setItem('arch-decisions:recommendations', '{invalid-json');

        // Act
        const result = getRecommendations();

        // Assert
        expect(result).toBeNull();
    });

    it('returns null when stored value does not match recommendations schema', () => {
        // Arrange
        sessionStorage.setItem('arch-decisions:recommendations', JSON.stringify({invalid: true}));

        // Act
        const result = getRecommendations();

        // Assert
        expect(result).toBeNull();
    });
});
