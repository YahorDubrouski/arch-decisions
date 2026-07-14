import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step2TrafficPattern} from '../Step2TrafficPattern';
import styles from '../Step2TrafficPattern.module.css';

describe('Step2TrafficPattern', () => {
    it('renders traffic pattern select', () => {
        const mockOnChange = vi.fn();
        render(<Step2TrafficPattern value={null} onChange={mockOnChange}/>);

        expect(screen.getByLabelText(/traffic pattern/i)).toBeInTheDocument();
    });

    it('displays current value', () => {
        const mockOnChange = vi.fn();
        render(<Step2TrafficPattern value="variable" onChange={mockOnChange}/>);

        const select = screen.getByLabelText(/traffic pattern/i) as HTMLSelectElement;
        expect(select.value).toBe('variable');
    });

    it('calls onChange when value changes', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step2TrafficPattern value={null} onChange={mockOnChange}/>);

        const select = screen.getByLabelText(/traffic pattern/i);
        await user.selectOptions(select, 'high-spike');

        expect(mockOnChange).toHaveBeenCalledWith('high-spike');
    });

    it('displays error message when error prop provided', () => {
        const mockOnChange = vi.fn();
        render(
            <Step2TrafficPattern
                value={null}
                onChange={mockOnChange}
                error="Traffic pattern is required"
            />
        );

        expect(screen.getByRole('alert')).toHaveTextContent('Traffic pattern is required');
    });

    it('applies error class when error exists', () => {
        const mockOnChange = vi.fn();
        render(<Step2TrafficPattern value={null} onChange={mockOnChange} error="Error message"/>);

        const select = screen.getByLabelText(/traffic pattern/i);
        expect(select).toHaveClass(styles.selectError);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
