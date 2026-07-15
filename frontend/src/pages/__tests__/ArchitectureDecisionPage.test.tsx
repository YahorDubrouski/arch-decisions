import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {ArchitectureDecision} from '@/domain/architectureDecision';
import {ArchitectureDecisionPage} from '@/pages/ArchitectureDecisionPage';

const mockRefetch = vi.fn();

vi.mock('@/features/architecture-decisions/hooks/useArchitectureDecisionQuery', () => ({
    useArchitectureDecisionQuery: () => mockUseArchitectureDecisionQuery(),
}));

let mockUseArchitectureDecisionQuery: () => {
    data?: ArchitectureDecision;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: typeof mockRefetch;
};

const sampleArchitectureDecision: ArchitectureDecision = {
    id: 'decision-1',
    title: 'Cloud Architecture Decisions',
    status: 'proposed',
    content: '# Architecture Decision Record\n\nCompute: ECS',
    summary: 'Use ECS for compute.',
    createdAt: '2026-01-01T00:00:00.000Z',
};

function renderPage(decisionId = 'decision-1') {
    return render(
        <MemoryRouter initialEntries={[`/architecture-decisions/${decisionId}`]}>
            <Routes>
                <Route path="/architecture-decisions/:decisionId" element={<ArchitectureDecisionPage/>}/>
            </Routes>
        </MemoryRouter>
    );
}

describe('ArchitectureDecisionPage', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseArchitectureDecisionQuery = () => ({
            data: sampleArchitectureDecision,
            isLoading: false,
            isError: false,
            error: null,
            refetch: mockRefetch,
        });
    });

    it('renders summary view by default', () => {
        renderPage();

        expect(screen.getByRole('heading', {name: 'Cloud Architecture Decisions'})).toBeInTheDocument();
        expect(screen.getByText('Use ECS for compute.')).toBeInTheDocument();
        expect(screen.queryByText(/Compute: ECS/)).not.toBeInTheDocument();
    });

    it('switches to full document view', async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole('button', {name: 'Full document'}));

        expect(screen.getByText(/Compute: ECS/)).toBeInTheDocument();
    });

    it('copies the active view and starts markdown download', async () => {
        const user = userEvent.setup();
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            value: {writeText},
            configurable: true,
        });

        renderPage();

        await user.click(screen.getByRole('button', {name: 'Copy summary'}));

        const click = vi.fn();
        const anchor = {click, download: '', href: ''} as HTMLAnchorElement;
        vi.spyOn(document, 'createElement').mockReturnValue(anchor);
        vi.stubGlobal('URL', {
            createObjectURL: vi.fn(() => 'blob:mock'),
            revokeObjectURL: vi.fn(),
        });

        await user.click(screen.getByRole('button', {name: 'Download markdown'}));

        await waitFor(() => {
            expect(writeText).toHaveBeenCalledWith('Use ECS for compute.');
            expect(click).toHaveBeenCalled();
        });
    });

    it('renders error state with retry', async () => {
        const user = userEvent.setup();
        mockUseArchitectureDecisionQuery = () => ({
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error('Architecture decision not found'),
            refetch: mockRefetch,
        });

        renderPage();

        expect(screen.getByRole('alert')).toHaveTextContent('Architecture decision not found');

        await user.click(screen.getByRole('button', {name: 'Try again'}));
        expect(mockRefetch).toHaveBeenCalled();
    });
});
