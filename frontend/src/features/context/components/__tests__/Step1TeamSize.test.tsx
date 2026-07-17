import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step1TeamSize} from '../Step1TeamSize';
import styles from '../Step1TeamSize.module.css';

describe('Step1TeamSize', () => {
    it('renders team size select', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step1TeamSize value={null} onChange={mockOnChange}/>);

        // Assert
        expect(screen.getByLabelText(/team size/i)).toBeInTheDocument();
    });

    it('displays current value', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step1TeamSize value="6-20" onChange={mockOnChange}/>);

        // Assert
        const select = screen.getByLabelText(/team size/i) as HTMLSelectElement;
        expect(select.value).toBe('6-20');
    });

    it('when user selects team size then form receives the selection', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step1TeamSize value={null} onChange={mockOnChange}/>);

        // Act
        const select = screen.getByLabelText(/team size/i);
        await user.selectOptions(select, '6-20');

        // Assert
        expect(mockOnChange).toHaveBeenCalledWith('6-20');
    });

    it('displays error message when error prop provided', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step1TeamSize value={null} onChange={mockOnChange} error="Team size is required"/>);

        // Assert
        expect(screen.getByRole('alert')).toHaveTextContent('Team size is required');
    });

    it('applies error class when error exists', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step1TeamSize value={null} onChange={mockOnChange} error="Error message"/>);

        // Assert
        const select = screen.getByLabelText(/team size/i);
        expect(select).toHaveClass(styles.selectError);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
