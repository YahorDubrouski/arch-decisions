import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step5OperationalMaturity} from '../Step5OperationalMaturity';
import styles from '../Step5OperationalMaturity.module.css';

describe('Step5OperationalMaturity', () => {
    it('renders operational maturity select', () => {
        const mockOnChange = vi.fn();
        render(<Step5OperationalMaturity value={null} onChange={mockOnChange}/>);

        expect(screen.getByLabelText(/operational maturity/i)).toBeInTheDocument();
    });

    it('displays current value', () => {
        const mockOnChange = vi.fn();
        render(<Step5OperationalMaturity value="moderate" onChange={mockOnChange}/>);

        const select = screen.getByLabelText(/operational maturity/i) as HTMLSelectElement;
        expect(select.value).toBe('moderate');
    });

    it('calls onChange when value changes', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step5OperationalMaturity value={null} onChange={mockOnChange}/>);

        const select = screen.getByLabelText(/operational maturity/i);
        await user.selectOptions(select, 'advanced');

        expect(mockOnChange).toHaveBeenCalledWith('advanced');
    });

    it('displays error message when error prop provided', () => {
        const mockOnChange = vi.fn();
        render(
            <Step5OperationalMaturity
                value={null}
                onChange={mockOnChange}
                error="Operational maturity is required"
            />
        );

        expect(screen.getByRole('alert')).toHaveTextContent('Operational maturity is required');
    });

    it('applies error class when error exists', () => {
        const mockOnChange = vi.fn();
        render(<Step5OperationalMaturity value={null} onChange={mockOnChange} error="Error message"/>);

        const select = screen.getByLabelText(/operational maturity/i);
        expect(select).toHaveClass(styles.selectError);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
