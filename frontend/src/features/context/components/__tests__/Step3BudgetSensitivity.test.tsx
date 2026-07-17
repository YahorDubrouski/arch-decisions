import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step3BudgetSensitivity} from '../Step3BudgetSensitivity';
import styles from '../Step3BudgetSensitivity.module.css';

describe('Step3BudgetSensitivity', () => {
    it('renders budget sensitivity select', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step3BudgetSensitivity value={null} onChange={mockOnChange}/>);

        // Assert
        expect(screen.getByLabelText(/budget sensitivity/i)).toBeInTheDocument();
    });

    it('displays current value', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step3BudgetSensitivity value="balanced" onChange={mockOnChange}/>);

        // Assert
        const select = screen.getByLabelText(/budget sensitivity/i) as HTMLSelectElement;
        expect(select.value).toBe('balanced');
    });

    it('when user selects budget sensitivity then form receives the selection', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step3BudgetSensitivity value={null} onChange={mockOnChange}/>);

        // Act
        const select = screen.getByLabelText(/budget sensitivity/i);
        await user.selectOptions(select, 'cost-optimized');

        // Assert
        expect(mockOnChange).toHaveBeenCalledWith('cost-optimized');
    });

    it('displays error message when error prop provided', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(
            <Step3BudgetSensitivity
                value={null}
                onChange={mockOnChange}
                error="Budget sensitivity is required"
            />
        );

        // Assert
        expect(screen.getByRole('alert')).toHaveTextContent('Budget sensitivity is required');
    });

    it('applies error class when error exists', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step3BudgetSensitivity value={null} onChange={mockOnChange} error="Error message"/>);

        // Assert
        const select = screen.getByLabelText(/budget sensitivity/i);
        expect(select).toHaveClass(styles.selectError);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
