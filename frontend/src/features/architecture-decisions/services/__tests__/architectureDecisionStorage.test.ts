import {afterEach, describe, expect, it} from 'vitest';
import {ArchitectureDecision} from '@/domain/architectureDecision';
import {
    clearArchitectureDecision,
    getArchitectureDecisionById,
    listArchitectureDecisionItems,
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

const newerDecision: ArchitectureDecision = {
    id: 'decision-2',
    title: 'Newer ADR',
    status: 'proposed',
    content: '# Newer',
    summary: 'Later document',
    createdAt: '2026-01-02T00:00:00.000Z',
};

describe('architectureDecisionStorage', () => {
    afterEach(() => {
        clearArchitectureDecision('decision-1');
        clearArchitectureDecision('decision-2');
    });

    /**
     * Given
     * - A valid architecture decision document.
     * When
     * - The document is saved to sessionStorage.
     * Then
     * - It can be read back by id unchanged.
     */
    it('saves and reads architecture decisions from sessionStorage', () => {
        // Arrange
        // (sampleArchitectureDecision fixture)

        // Act
        saveArchitectureDecision(sampleArchitectureDecision);

        // Assert
        expect(getArchitectureDecisionById('decision-1')).toEqual(sampleArchitectureDecision);
    });

    /**
     * Given
     * - Invalid JSON stored for a decision id.
     * When
     * - The decision is read by id.
     * Then
     * - Null is returned instead of throwing.
     */
    it('returns null for invalid stored architecture decision', () => {
        // Arrange
        sessionStorage.setItem('arch-decisions:architecture-decision:decision-1', '{invalid-json');

        // Act
        const decision = getArchitectureDecisionById('decision-1');

        // Assert
        expect(decision).toBeNull();
    });

    /**
     * Given
     * - Two saved decisions with different createdAt timestamps.
     * When
     * - Stored decisions are listed.
     * Then
     * - Newest items appear first and content is omitted from list items.
     */
    it('lists stored decisions newest first without content', () => {
        // Arrange
        saveArchitectureDecision(sampleArchitectureDecision);
        saveArchitectureDecision(newerDecision);

        // Act
        const listed = listArchitectureDecisionItems();

        // Assert
        expect(listed).toEqual([
            {
                id: 'decision-2',
                title: 'Newer ADR',
                status: 'proposed',
                summary: 'Later document',
                createdAt: '2026-01-02T00:00:00.000Z',
            },
            {
                id: 'decision-1',
                title: 'Cloud Architecture Decisions',
                status: 'proposed',
                summary: 'Summary text',
                createdAt: '2026-01-01T00:00:00.000Z',
            },
        ]);
    });
});
