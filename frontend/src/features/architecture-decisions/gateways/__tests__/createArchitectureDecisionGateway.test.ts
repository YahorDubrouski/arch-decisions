import {afterEach, describe, expect, it, vi} from 'vitest';
import {createArchitectureDecisionGateway} from '../createArchitectureDecisionGateway';

describe('createArchitectureDecisionGateway', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    /**
     * Given
     * - VITE_DATA_SOURCE is configured as http.
     * When
     * - The architecture decision gateway is created.
     * Then
     * - An http adapter with list, getById, and generate is returned.
     */
    it('returns the http adapter when VITE_DATA_SOURCE is http', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'http');

        // Act
        const gateway = createArchitectureDecisionGateway();

        // Assert
        expect(gateway.list).toEqual(expect.any(Function));
        expect(gateway.getById).toEqual(expect.any(Function));
        expect(gateway.generate).toEqual(expect.any(Function));
    });

    /**
     * Given
     * - VITE_DATA_SOURCE is configured as local.
     * When
     * - The architecture decision gateway is created.
     * Then
     * - A local adapter with list and getById is returned.
     */
    it('returns the local adapter when VITE_DATA_SOURCE is local', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'local');

        // Act
        const gateway = createArchitectureDecisionGateway();

        // Assert
        expect(gateway.list).toEqual(expect.any(Function));
        expect(gateway.getById).toEqual(expect.any(Function));
    });
});
