import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {DecisionsPage} from '../DecisionsPage';

describe('DecisionsPage', () => {
    it('renders title and empty state message', () => {
        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {name: /architecture decisions/i})).toBeInTheDocument();
        expect(screen.getByText(/no decisions to display yet/i)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('link', {name: /edit context/i})).toHaveAttribute('href', '/context');
        expect(screen.getByRole('link', {name: /home/i})).toHaveAttribute('href', '/');
    });
});
