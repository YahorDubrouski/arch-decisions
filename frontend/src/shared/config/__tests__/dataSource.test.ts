import {afterEach, describe, expect, it, vi} from 'vitest';
import {getDataSource} from '../dataSource';

describe('getDataSource', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    /**
     * Given
     * - VITE_DATA_SOURCE is unset.
     * When
     * - The data source is resolved.
     * Then
     * - http is used as the default.
     */
    it('defaults to http when VITE_DATA_SOURCE is unset', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', undefined);

        // Act
        const dataSource = getDataSource();

        // Assert
        expect(dataSource).toBe('http');
    });

    /**
     * Given
     * - VITE_DATA_SOURCE is configured as http.
     * When
     * - The data source is resolved.
     * Then
     * - http is returned.
     */
    it('returns http when configured', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'http');

        // Act
        const dataSource = getDataSource();

        // Assert
        expect(dataSource).toBe('http');
    });

    /**
     * Given
     * - VITE_DATA_SOURCE is configured as local.
     * When
     * - The data source is resolved.
     * Then
     * - local is returned.
     */
    it('returns local when configured', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'local');

        // Act
        const dataSource = getDataSource();

        // Assert
        expect(dataSource).toBe('local');
    });

    /**
     * Given
     * - VITE_DATA_SOURCE has an unknown value.
     * When
     * - The data source is resolved.
     * Then
     * - http is used as a safe fallback.
     */
    it('falls back to http for unknown values', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'redis');

        // Act
        const dataSource = getDataSource();

        // Assert
        expect(dataSource).toBe('http');
    });

    /**
     * Given
     * - VITE_DATA_SOURCE uses mixed casing.
     * When
     * - The data source is resolved.
     * Then
     * - The normalized lowercase value is returned.
     */
    it('normalizes casing', () => {
        // Arrange
        vi.stubEnv('VITE_DATA_SOURCE', 'LOCAL');

        // Act
        const dataSource = getDataSource();

        // Assert
        expect(dataSource).toBe('local');
    });
});
