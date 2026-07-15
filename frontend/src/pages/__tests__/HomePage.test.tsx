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
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <HomePage/>
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', {name: 'Start new project'}));

        expect(mockNavigate).toHaveBeenCalledWith('/context');
    });

    it('clears session and navigates after confirm when session has data', async () => {
        sessionStorage.setItem('arch-decisions:context', '{}');
        sessionStorage.setItem('arch-decisions:decisions', '{}');
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <HomePage/>
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', {name: 'Start new project'}));

        expect(window.confirm).toHaveBeenCalled();
        expect(sessionStorage.getItem('arch-decisions:context')).toBeNull();
        expect(sessionStorage.getItem('arch-decisions:decisions')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/context');
    });

    it('keeps session and does not navigate when confirm is cancelled', async () => {
        sessionStorage.setItem('arch-decisions:context', '{}');
        vi.spyOn(window, 'confirm').mockReturnValue(false);

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <HomePage/>
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', {name: 'Start new project'}));

        expect(sessionStorage.getItem('arch-decisions:context')).toBe('{}');
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
