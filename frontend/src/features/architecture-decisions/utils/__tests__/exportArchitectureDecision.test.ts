import {describe, expect, it, vi} from 'vitest';
import {
    downloadArchitectureDecisionMarkdown,
    getArchitectureDecisionDisplayText,
} from '@/features/architecture-decisions/utils/exportArchitectureDecision';

describe('exportArchitectureDecision', () => {
    it('returns summary or full content based on view mode', () => {
        const architectureDecision = {
            summary: 'Short summary',
            content: '# Full markdown',
        };

        expect(getArchitectureDecisionDisplayText(architectureDecision, 'summary')).toBe('Short summary');
        expect(getArchitectureDecisionDisplayText(architectureDecision, 'full')).toBe('# Full markdown');
    });

    it('downloads markdown with a normalized file name', () => {
        const click = vi.fn();
        const anchor = {click, download: '', href: ''} as HTMLAnchorElement;
        const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor);

        vi.stubGlobal('URL', {
            createObjectURL: vi.fn(() => 'blob:mock'),
            revokeObjectURL: vi.fn(),
        });

        downloadArchitectureDecisionMarkdown('Cloud Architecture Decisions', '# Title');

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(anchor.download).toBe('cloud-architecture-decisions.md');
        expect(click).toHaveBeenCalled();

        createElementSpy.mockRestore();
        vi.unstubAllGlobals();
    });
});
