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

    it('resolves application controllers and services from the container', () => {
        process.env.STORAGE_PROVIDER = 'memory';

        const container = createAppContainer();

        expect(container.resolve('decisionsController')).toBeDefined();
        expect(container.resolve('architectureDecisionsController')).toBeDefined();
        expect(container.resolve('evaluateDecisionsService')).toBeDefined();
        expect(container.resolve('generateArchitectureDecisionService')).toBeDefined();
    });

    it('reuses singleton registrations across resolves', () => {
        process.env.STORAGE_PROVIDER = 'memory';

        const container = createAppContainer();

        expect(container.resolve('architectureDecisionRepository')).toBe(
            container.resolve('architectureDecisionRepository')
        );
    });
});
