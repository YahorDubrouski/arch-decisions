import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {HomePage} from '../HomePage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('HomePage', () => {
    beforeEach(() => {
        sessionStorage.clear();
        mockNavigate.mockReset();
        vi.restoreAllMocks();
    });

    it('starts a new project without confirm when session is empty', async () => {
        // Arrange
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <HomePage/>
            </MemoryRouter>
        );

        // Act
        await user.click(screen.getByRole('button', {name: 'Start new project'}));

        // Assert
        expect(mockNavigate).toHaveBeenCalledWith('/context');
    });

    /**
     * Given
     * - Session storage already holds project data and the user confirms reset.
     * When
     * - The user starts a new project.
     * Then
     * - Session is cleared and navigation moves to the context workflow.
     */
    it('clears session and navigates after confirm when session has data', async () => {
        // Arrange
        sessionStorage.setItem('arch-decisions:context', '{}');
        sessionStorage.setItem('arch-decisions:recommendations', '{}');
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <HomePage/>
            </MemoryRouter>
        );

        // Act
        await user.click(screen.getByRole('button', {name: 'Start new project'}));

        // Assert
        expect(window.confirm).toHaveBeenCalled();
        expect(sessionStorage.getItem('arch-decisions:context')).toBeNull();
        expect(sessionStorage.getItem('arch-decisions:recommendations')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/context');
    });

    /**
     * Given
     * - Session storage holds project data and the user declines reset.
     * When
     * - The user starts a new project.
     * Then
     * - Session is preserved and navigation does not occur.
     */
    it('keeps session and does not navigate when confirm is cancelled', async () => {
        // Arrange
        sessionStorage.setItem('arch-decisions:context', '{}');
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <HomePage/>
            </MemoryRouter>
        );

        // Act
        await user.click(screen.getByRole('button', {name: 'Start new project'}));

        // Assert
        expect(sessionStorage.getItem('arch-decisions:context')).toBe('{}');
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
