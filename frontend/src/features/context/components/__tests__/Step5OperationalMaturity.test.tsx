import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step5OperationalMaturity} from '../Step5OperationalMaturity';
import styles from '../Step5OperationalMaturity.module.css';

describe('Step5OperationalMaturity', () => {
    it('renders operational maturity select', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step5OperationalMaturity value={null} onChange={mockOnChange}/>);

        // Assert
        expect(screen.getByLabelText(/operational maturity/i)).toBeInTheDocument();
    });

    it('displays current value', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step5OperationalMaturity value="moderate" onChange={mockOnChange}/>);

        // Assert
        const select = screen.getByLabelText(/operational maturity/i) as HTMLSelectElement;
        expect(select.value).toBe('moderate');
    });

    it('when user selects operational maturity then form receives the selection', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step5OperationalMaturity value={null} onChange={mockOnChange}/>);

        // Act
        const select = screen.getByLabelText(/operational maturity/i);
        await user.selectOptions(select, 'advanced');

        // Assert
        expect(mockOnChange).toHaveBeenCalledWith('advanced');
    });

    it('displays error message when error prop provided', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(
            <Step5OperationalMaturity
                value={null}
                onChange={mockOnChange}
                error="Operational maturity is required"
            />
        );

        // Assert
        expect(screen.getByRole('alert')).toHaveTextContent('Operational maturity is required');
    });

    it('applies error class when error exists', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step5OperationalMaturity value={null} onChange={mockOnChange} error="Error message"/>);

        // Assert
        const select = screen.getByLabelText(/operational maturity/i);
        expect(select).toHaveClass(styles.selectError);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
