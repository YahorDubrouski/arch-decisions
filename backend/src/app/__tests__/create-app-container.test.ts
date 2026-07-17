import {afterEach, describe, expect, it} from '@jest/globals';
import {createAppContainer} from '@/app/create-app-container';

describe('createAppContainer', () => {
    const originalStorageProvider = process.env.STORAGE_PROVIDER;

    afterEach(() => {
        if (originalStorageProvider === undefined) {
            delete process.env.STORAGE_PROVIDER;
        } else {
            process.env.STORAGE_PROVIDER = originalStorageProvider;
        }
    });

    /**
     * Given
     * - Storage provider is configured for in-memory use.
     * When
     * - The application container is created.
     * Then
     * - Controllers and services resolve successfully.
     */
    it('when container is created then resolve controllers and services', () => {
        // Arrange
        process.env.STORAGE_PROVIDER = 'memory';

        // Act
        const container = createAppContainer();

        // Assert
        expect(container.resolve('recommendationsController')).toBeDefined();
        expect(container.resolve('architectureDecisionsController')).toBeDefined();
        expect(container.resolve('jobsController')).toBeDefined();
        expect(container.resolve('enqueueArchitectureJobService')).toBeDefined();
        expect(container.resolve('evaluateRecommendationsService')).toBeDefined();
        expect(container.resolve('generateArchitectureDecisionService')).toBeDefined();
    });

    /**
     * Given
     * - Storage provider is configured for in-memory use.
     * When
     * - The same singleton is resolved twice.
     * Then
     * - Both resolves return the same instance.
     */
    it('when singleton is resolved twice then reuse the same instance', () => {
        // Arrange
        process.env.STORAGE_PROVIDER = 'memory';
        const container = createAppContainer();

        // Act
        const firstResolve = container.resolve('architectureDecisionRepository');
        const secondResolve = container.resolve('architectureDecisionRepository');

        // Assert
        expect(firstResolve).toBe(secondResolve);
    });
});
