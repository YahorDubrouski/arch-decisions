import {describe, expect, it, vi} from 'vitest';
import {
    downloadArchitectureDecisionMarkdown,
    getArchitectureDecisionDisplayText,
} from '@/features/architecture-decisions/utils/exportArchitectureDecision';

describe('exportArchitectureDecision', () => {
    it('returns summary or full content based on view mode', () => {
        // Arrange
        const architectureDecision = {
            summary: 'Short summary',
            content: '# Full markdown',
        };

        // Act
        const summaryText = getArchitectureDecisionDisplayText(architectureDecision, 'summary');
        const fullText = getArchitectureDecisionDisplayText(architectureDecision, 'full');

        // Assert
        expect(summaryText).toBe('Short summary');
        expect(fullText).toBe('# Full markdown');
    });

    /**
     * Given
     * - A decision title and markdown body.
     * When
     * - The user downloads the decision as markdown.
     * Then
     * - A normalized file name is used and the download link is clicked.
     */
    it('downloads markdown with a normalized file name', () => {
        // Arrange
        const click = vi.fn();
        const anchor = {click, download: '', href: ''} as HTMLAnchorElement;
        const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor);
        vi.stubGlobal('URL', {
            createObjectURL: vi.fn(() => 'blob:mock'),
            revokeObjectURL: vi.fn(),
        });

        // Act
        downloadArchitectureDecisionMarkdown('Cloud Architecture Decisions', '# Title');

        // Assert
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(anchor.download).toBe('cloud-architecture-decisions.md');
        expect(click).toHaveBeenCalled();

        createElementSpy.mockRestore();
        vi.unstubAllGlobals();
    });
});
