import {afterEach, describe, expect, it} from 'vitest';
import {ArchitectureDecision} from '@/domain/architectureDecision';
import {
    clearArchitectureDecision,
    getArchitectureDecisionById,
    saveArchitectureDecision,
} from '@/features/architecture-decisions/services/architectureDecisionStorage';

const sampleArchitectureDecision: ArchitectureDecision = {
    id: 'decision-1',
    title: 'Cloud Architecture Decisions',
    status: 'proposed',
    content: '# Architecture Decision Record',
    summary: 'Summary text',
    createdAt: '2026-01-01T00:00:00.000Z',
};

describe('architectureDecisionStorage', () => {
    afterEach(() => {
        clearArchitectureDecision('decision-1');
    });

    it('saves and reads architecture decisions from sessionStorage', () => {
        saveArchitectureDecision(sampleArchitectureDecision);

        expect(getArchitectureDecisionById('decision-1')).toEqual(sampleArchitectureDecision);
    });

    it('returns null for invalid stored architecture decision', () => {
        sessionStorage.setItem('arch-decisions:architecture-decision:decision-1', '{invalid-json');

        expect(getArchitectureDecisionById('decision-1')).toBeNull();
    });
});
