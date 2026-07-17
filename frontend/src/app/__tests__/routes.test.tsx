import {describe, expect, it} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AppRoutes} from '../routes';

describe('AppRoutes', () => {
    /**
     * Given
     * - The app router is mounted at the home path.
     * When
     * - The home route lazy chunk loads.
     * Then
     * - A loading state appears first, then the home page content renders.
     */
    it('lazy-loads the home route and eventually renders it', async () => {
        // Arrange
        // (router at home path)

        // Act
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes/>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('status')).toHaveTextContent(/loading page/i);

        await waitFor(() => {
            expect(
                screen.getByRole('heading', {
                    name: /turn context into clear infrastructure decisions/i,
                })
            ).toBeInTheDocument();
        });
    });
});
