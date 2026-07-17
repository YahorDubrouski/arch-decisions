import {describe, expect, it} from 'vitest';
import {matchesArchitectureDecisionListFilters} from '../architectureDecisionFilters';

describe('matchesArchitectureDecisionListFilters', () => {
    const item = {
        id: '1',
        title: 'Enterprise compliance platform',
        status: 'proposed' as const,
        summary: 'SOC2 oriented stack',
        createdAt: '2026-01-01T00:00:00.000Z',
    };

    /**
     * Given
     * - A list item with compliance-related title and summary.
     * When
     * - Search filters are applied.
     * Then
     * - Matches occur for title or summary terms and non-matching terms are rejected.
     */
    it('matches search against title and summary', () => {
        // Arrange
        const filtersMatchingTitle = {search: 'compliance'};
        const filtersMatchingSummary = {search: 'SOC2'};
        const filtersWithNoMatch = {search: 'lambda'};

        // Act
        const matchesTitle = matchesArchitectureDecisionListFilters(item, filtersMatchingTitle);
        const matchesSummary = matchesArchitectureDecisionListFilters(item, filtersMatchingSummary);
        const matchesNone = matchesArchitectureDecisionListFilters(item, filtersWithNoMatch);

        // Assert
        expect(matchesTitle).toBe(true);
        expect(matchesSummary).toBe(true);
        expect(matchesNone).toBe(false);
    });

    /**
     * Given
     * - A proposed architecture decision list item.
     * When
     * - Status filters are applied.
     * Then
     * - Only the matching status passes the filter.
     */
    it('filters by status', () => {
        // Arrange
        const proposedFilter = {status: 'proposed' as const};
        const acceptedFilter = {status: 'accepted' as const};

        // Act
        const matchesProposed = matchesArchitectureDecisionListFilters(item, proposedFilter);
        const matchesAccepted = matchesArchitectureDecisionListFilters(item, acceptedFilter);

        // Assert
        expect(matchesProposed).toBe(true);
        expect(matchesAccepted).toBe(false);
    });
});
