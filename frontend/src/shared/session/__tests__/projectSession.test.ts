import {beforeEach, describe, expect, it} from 'vitest';
import {clearProjectSession, hasProjectSession} from '../projectSession';

describe('projectSession', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('reports empty session when no project keys exist', () => {
        // Arrange
        sessionStorage.setItem('other-app:data', 'value');

        // Act
        const hasSession = hasProjectSession();

        // Assert
        expect(hasSession).toBe(false);
    });

    it('reports active session when project keys exist', () => {
        // Arrange
        sessionStorage.setItem('arch-decisions:context', '{}');

        // Act
        const hasSession = hasProjectSession();

        // Assert
        expect(hasSession).toBe(true);
    });

    /**
     * Given
     * - Session storage holds project data and unrelated app data.
     * When
     * - The project session is cleared.
     * Then
     * - Project keys are removed, unrelated keys remain, and session is empty.
     */
    it('clears context, recommendations, and architecture decision keys', () => {
        // Arrange
        sessionStorage.setItem('arch-decisions:context', '{"teamSize":"1-5"}');
        sessionStorage.setItem('arch-decisions:recommendations', '{"compute":{}}');
        sessionStorage.setItem('arch-decisions:architecture-decision:decision-1', '{}');
        sessionStorage.setItem('other-app:data', 'keep');

        // Act
        clearProjectSession();

        // Assert
        expect(sessionStorage.getItem('arch-decisions:context')).toBeNull();
        expect(sessionStorage.getItem('arch-decisions:recommendations')).toBeNull();
        expect(sessionStorage.getItem('arch-decisions:architecture-decision:decision-1')).toBeNull();
        expect(sessionStorage.getItem('other-app:data')).toBe('keep');
        expect(hasProjectSession()).toBe(false);
    });
});
