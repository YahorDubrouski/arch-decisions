import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step2TrafficPattern} from '../Step2TrafficPattern';
import styles from '../Step2TrafficPattern.module.css';

describe('Step2TrafficPattern', () => {
    it('renders traffic pattern select', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step2TrafficPattern value={null} onChange={mockOnChange}/>);

        // Assert
        expect(screen.getByLabelText(/traffic pattern/i)).toBeInTheDocument();
    });

    it('displays current value', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step2TrafficPattern value="variable" onChange={mockOnChange}/>);

        // Assert
        const select = screen.getByLabelText(/traffic pattern/i) as HTMLSelectElement;
        expect(select.value).toBe('variable');
    });

    it('when user selects traffic pattern then form receives the selection', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step2TrafficPattern value={null} onChange={mockOnChange}/>);

        // Act
        const select = screen.getByLabelText(/traffic pattern/i);
        await user.selectOptions(select, 'high-spike');

        // Assert
        expect(mockOnChange).toHaveBeenCalledWith('high-spike');
    });

    it('displays error message when error prop provided', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(
            <Step2TrafficPattern
                value={null}
                onChange={mockOnChange}
                error="Traffic pattern is required"
            />
        );

        // Assert
        expect(screen.getByRole('alert')).toHaveTextContent('Traffic pattern is required');
    });

    it('applies error class when error exists', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step2TrafficPattern value={null} onChange={mockOnChange} error="Error message"/>);

        // Assert
        const select = screen.getByLabelText(/traffic pattern/i);
        expect(select).toHaveClass(styles.selectError);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
