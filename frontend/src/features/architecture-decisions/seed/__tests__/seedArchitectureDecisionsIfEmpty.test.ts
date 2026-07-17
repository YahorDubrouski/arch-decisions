import {afterEach, describe, expect, it} from 'vitest';
import {architectureDecisionSeeds} from '@/features/architecture-decisions/seed/architectureDecisionSeeds';
import {seedArchitectureDecisionsIfEmpty} from '@/features/architecture-decisions/seed/seedArchitectureDecisionsIfEmpty';
import {
    clearArchitectureDecision,
    listArchitectureDecisionItems,
    saveArchitectureDecision,
} from '@/features/architecture-decisions/services/architectureDecisionStorage';
import {ArchitectureDecision} from '@/domain/architectureDecision';

const userDecision: ArchitectureDecision = {
    id: 'user-generated-1',
    title: 'User generated ADR',
    status: 'proposed',
    content: '# User ADR',
    summary: 'Created by the user',
    createdAt: '2026-02-01T00:00:00.000Z',
};

describe('seedArchitectureDecisionsIfEmpty', () => {
    afterEach(() => {
        for (const seed of architectureDecisionSeeds) {
            clearArchitectureDecision(seed.id);
        }
        clearArchitectureDecision(userDecision.id);
    });

    /**
     * Given
     * - Storage has no architecture decisions.
     * When
     * - Seeding runs.
     * Then
     * - All demo seed documents are stored.
     */
    it('seeds demo documents when storage is empty', () => {
        // Arrange
        // (storage is cleared in afterEach)

        // Act
        seedArchitectureDecisionsIfEmpty();

        // Assert
        const listed = listArchitectureDecisionItems();
        expect(listed).toHaveLength(architectureDecisionSeeds.length);
        expect(listed.map((item) => item.id).sort()).toEqual(
            [...architectureDecisionSeeds.map((seed) => seed.id)].sort()
        );
    });

    /**
     * Given
     * - A user-generated document already exists in storage.
     * When
     * - Seeding runs more than once.
     * Then
     * - User content is kept and missing catalog seeds are added without duplicates.
     */
    it('adds missing seeds without overwriting user-generated documents', () => {
        // Arrange
        saveArchitectureDecision(userDecision);

        // Act
        seedArchitectureDecisionsIfEmpty();
        seedArchitectureDecisionsIfEmpty();

        // Assert
        const listed = listArchitectureDecisionItems();
        expect(listed).toHaveLength(architectureDecisionSeeds.length + 1);
        expect(listed.some((item) => item.id === userDecision.id)).toBe(true);
        expect(getSeedIds(listed)).toEqual(
            [...architectureDecisionSeeds.map((seed) => seed.id)].sort()
        );
    });
});

function getSeedIds(items: {id: string}[]): string[] {
    return items
        .map((item) => item.id)
        .filter((id) => id.startsWith('seed-'))
        .sort();
}
