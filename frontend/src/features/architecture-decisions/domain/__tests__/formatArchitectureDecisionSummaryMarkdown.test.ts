import {describe, expect, it} from 'vitest';
import {formatArchitectureDecisionSummaryMarkdown} from '@/features/architecture-decisions/domain/formatArchitectureDecisionSummaryMarkdown';

describe('formatArchitectureDecisionSummaryMarkdown', () => {
    /**
     * Given
     * - Plain summary text without category markers.
     * When
     * - Summary markdown is formatted.
     * Then
     * - Output includes a Summary heading with the original text.
     */
    it('wraps plain summary text in a Summary heading', () => {
        // Arrange
        const summary = 'Use ECS for compute.';

        // Act
        const markdown = formatArchitectureDecisionSummaryMarkdown(summary);

        // Assert
        expect(markdown).toContain('## Summary\n\nUse ECS for compute.');
    });

    /**
     * Given
     * - Summary text with compute, secrets, and CI/CD category markers.
     * When
     * - Summary markdown is formatted.
     * Then
     * - Output includes a recommendations section with labeled bullets for each category.
     */
    it('extracts recommendation bullets when category markers are present', () => {
        // Arrange
        const summary =
            'Proposed architecture for a 1-5 team: ECS (compute), AWS Secrets Manager (secrets), and GitHub Actions (CI/CD), chosen for cost-optimized budget.';

        // Act
        const markdown = formatArchitectureDecisionSummaryMarkdown(summary);

        // Assert
        expect(markdown).toContain('### Recommendations at a glance');
        expect(markdown).toContain('- **Compute:** ECS');
        expect(markdown).toContain('- **Secrets:** AWS Secrets Manager');
        expect(markdown).toContain('- **CI/CD:** GitHub Actions');
    });
});
