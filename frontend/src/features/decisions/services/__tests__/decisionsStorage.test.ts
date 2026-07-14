import {afterEach, describe, expect, it} from 'vitest';
import {DecisionsResponse} from '@/domain/decisions';
import {clearDecisions, getDecisions, saveDecisions} from '../decisionsStorage';

const sampleDecisions: DecisionsResponse = {
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

describe('decisionsStorage', () => {
    afterEach(() => {
        clearDecisions();
    });

    it('returns null when no decisions are stored', () => {
        expect(getDecisions()).toBeNull();
    });

    it('saves and reads decisions from sessionStorage', () => {
        saveDecisions(sampleDecisions);

        expect(getDecisions()).toEqual(sampleDecisions);
    });

    it('clears stored decisions', () => {
        saveDecisions(sampleDecisions);
        clearDecisions();

        expect(getDecisions()).toBeNull();
    });

    it('returns null when stored value is invalid JSON', () => {
        sessionStorage.setItem('arch-decisions:decisions', '{invalid-json');

        expect(getDecisions()).toBeNull();
    });
});
