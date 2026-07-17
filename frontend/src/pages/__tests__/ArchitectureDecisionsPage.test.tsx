import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import type {ArchitectureDecisionListItem} from '@/domain/architectureDecision';
import {ArchitectureDecisionsPage} from '../ArchitectureDecisionsPage';

const mockRefetch = vi.fn();

vi.mock('@/features/architecture-decisions/hooks/useArchitectureDecisionsQuery', () => ({
    useArchitectureDecisionsQuery: (filters: unknown) => mockUseArchitectureDecisionsQuery(filters),
}));

let mockUseArchitectureDecisionsQuery: (filters: unknown) => {
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

    /**
     * Given
     * - No saved architecture decisions exist.
     * When
     * - The page is rendered.
     * Then
     * - An empty state and link to start the context workflow are shown.
     */
    it('renders empty state when there are no saved documents', () => {
        // Arrange
        // (default mock returns no documents)

        // Act
        render(
            <MemoryRouter>
                <ArchitectureDecisionsPage/>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('heading', {name: /saved architecture decisions/i})).toBeInTheDocument();
        expect(screen.getByText(/no architecture decisions saved yet/i)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: /start context workflow/i})).toHaveAttribute(
            'href',
            '/context'
        );
    });

    /**
     * Given
     * - At least one saved architecture decision exists.
     * When
     * - The page is rendered.
     * Then
     * - A documents table with title link and summary is shown.
     */
    it('renders a documents grid when results exist', () => {
        // Arrange
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

        // Act
        render(
            <MemoryRouter>
                <ArchitectureDecisionsPage/>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('table', {name: /saved architecture decision documents/i})).toBeInTheDocument();
        expect(
            screen.getByRole('link', {name: 'Cloud Architecture Decisions'})
        ).toHaveAttribute('href', '/architecture-decisions/decision-1');
        expect(screen.getByText('Use ECS for compute.')).toBeInTheDocument();
    });

    /**
     * Given
     * - The page is open with no matching documents.
     * When
     * - The user applies search and status filters.
     * Then
     * - The query receives the filter values and a no-match message is shown.
     */
    it('applies draft filters to the URL', async () => {
        // Arrange
        const user = userEvent.setup();
        const capturedFilters: unknown[] = [];
        mockUseArchitectureDecisionsQuery = (filters) => {
            capturedFilters.push(filters);
            return {
                data: [],
                isLoading: false,
                isError: false,
                error: null,
                refetch: mockRefetch,
            };
        };

        render(
            <MemoryRouter initialEntries={['/architecture-decisions']}>
                <ArchitectureDecisionsPage/>
            </MemoryRouter>
        );

        // Act
        await user.type(screen.getByLabelText(/search/i), 'ECS');
        await user.selectOptions(screen.getByLabelText(/status/i), 'proposed');
        await user.click(screen.getByRole('button', {name: /apply filters/i}));

        // Assert
        expect(capturedFilters.at(-1)).toEqual({
            search: 'ECS',
            status: 'proposed',
            page: 1,
            pageSize: 5,
        });
        expect(screen.getByText(/no documents match these filters/i)).toBeInTheDocument();
    });

    /**
     * Given
     * - Twelve saved documents with page size five.
     * When
     * - The user moves to the next page.
     * Then
     * - Page two items and pagination summary are shown.
     */
    it('paginates documents and updates the URL page', async () => {
        // Arrange
        const user = userEvent.setup();
        const manyDocuments: ArchitectureDecisionListItem[] = Array.from({length: 12}, (_, index) => ({
            id: `decision-${index + 1}`,
            title: `Document ${index + 1}`,
            status: 'proposed',
            summary: `Summary ${index + 1}`,
            createdAt: '2026-01-01T00:00:00.000Z',
        }));

        mockUseArchitectureDecisionsQuery = () => ({
            data: manyDocuments,
            isLoading: false,
            isError: false,
            error: null,
            refetch: mockRefetch,
        });

        render(
            <MemoryRouter initialEntries={['/architecture-decisions']}>
                <ArchitectureDecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('link', {name: 'Document 1'})).toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'Document 6'})).not.toBeInTheDocument();
        expect(screen.getByText(/showing 1–5 of 12/i)).toBeInTheDocument();

        // Act
        await user.click(screen.getByRole('button', {name: /next/i}));

        // Assert
        expect(screen.getByRole('link', {name: 'Document 6'})).toBeInTheDocument();
        expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();
    });
});
