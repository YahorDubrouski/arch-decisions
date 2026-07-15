import {beforeEach, describe, expect, it} from 'vitest';
import {clearProjectSession, hasProjectSession} from '../projectSession';

describe('projectSession', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('reports empty session when no project keys exist', () => {
        sessionStorage.setItem('other-app:data', 'value');

        expect(hasProjectSession()).toBe(false);
    });

    it('reports active session when project keys exist', () => {
        sessionStorage.setItem('arch-decisions:context', '{}');

        expect(hasProjectSession()).toBe(true);
    });

    it('clears context, decisions, and architecture decision keys', () => {
        sessionStorage.setItem('arch-decisions:context', '{"teamSize":"1-5"}');
        sessionStorage.setItem('arch-decisions:decisions', '{"compute":{}}');
        sessionStorage.setItem('arch-decisions:architecture-decision:decision-1', '{}');
        sessionStorage.setItem('other-app:data', 'keep');

        clearProjectSession();

        expect(sessionStorage.getItem('arch-decisions:context')).toBeNull();
        expect(sessionStorage.getItem('arch-decisions:decisions')).toBeNull();
        expect(sessionStorage.getItem('arch-decisions:architecture-decision:decision-1')).toBeNull();
        expect(sessionStorage.getItem('other-app:data')).toBe('keep');
        expect(hasProjectSession()).toBe(false);
    });
});
