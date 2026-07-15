import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import type {ArchitectureDecisionListItem} from '@/domain/architectureDecision';
import {ArchitectureDecisionsPage} from '../ArchitectureDecisionsPage';

const mockRefetch = vi.fn();

vi.mock('@/features/architecture-decisions/hooks/useArchitectureDecisionsQuery', () => ({
    useArchitectureDecisionsQuery: () => mockUseArchitectureDecisionsQuery(),
}));

let mockUseArchitectureDecisionsQuery: () => {
    data?: ArchitectureDecisionListItem[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: typeof mockRefetch;
};

describe('ArchitectureDecisionsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseArchitectureDecisionsQuery = () => ({
            data: [],
            isLoading: false,
            isError: false,
            error: null,
            refetch: mockRefetch,
        });
    });

    it('renders empty state when there are no saved documents', () => {
        render(
            <MemoryRouter>
                <ArchitectureDecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {name: /saved architecture decisions/i})).toBeInTheDocument();
        expect(screen.getByText(/no architecture decisions saved yet/i)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: /start context workflow/i})).toHaveAttribute(
            'href',
            '/context'
        );
    });

    it('renders saved document links', () => {
        mockUseArchitectureDecisionsQuery = () => ({
            data: [
                {
                    id: 'decision-1',
                    title: 'Cloud Architecture Decisions',
                    status: 'proposed',
                    summary: 'Use ECS for compute.',
                    createdAt: '2026-01-01T00:00:00.000Z',
                },
            ],
            isLoading: false,
            isError: false,
            error: null,
            refetch: mockRefetch,
        });

        render(
            <MemoryRouter>
                <ArchitectureDecisionsPage/>
            </MemoryRouter>
        );

        expect(
            screen.getByRole('link', {name: 'Cloud Architecture Decisions'})
        ).toHaveAttribute('href', '/architecture-decisions/decision-1');
        expect(screen.getByText('Use ECS for compute.')).toBeInTheDocument();
    });
});
