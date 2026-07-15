import {afterEach, describe, expect, it} from 'vitest';
import {ProjectContext} from '@/domain/context';
import {
    clearProjectContext,
    getProjectContext,
    saveProjectContext,
} from '@/features/context/services/contextStorage';

const sampleContext: ProjectContext = {
    teamSize: '6-20',
    trafficPattern: 'variable',
    budgetSensitivity: 'balanced',
    complianceRequirements: ['SOC2'],
    operationalMaturity: 'moderate',
};

describe('contextStorage', () => {
    afterEach(() => {
        clearProjectContext();
    });

    it('saves and reads project context from sessionStorage', () => {
        saveProjectContext(sampleContext);

        expect(getProjectContext()).toEqual(sampleContext);
    });

    it('returns null for invalid stored context', () => {
        sessionStorage.setItem('arch-decisions:context', JSON.stringify({invalid: true}));

        expect(getProjectContext()).toBeNull();
    });
});
