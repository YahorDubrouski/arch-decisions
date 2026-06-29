import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step1TeamSize} from '../Step1TeamSize';
import styles from '../Step1TeamSize.module.css';

describe('Step1TeamSize', () => {
    it('renders team size select', () => {
        const mockOnChange = vi.fn();
        render(<Step1TeamSize value={null} onChange={mockOnChange}/>);

        expect(screen.getByLabelText(/team size/i)).toBeInTheDocument();
    });

    it('displays current value', () => {
        const mockOnChange = vi.fn();
        render(<Step1TeamSize value="6-20" onChange={mockOnChange}/>);

        const select = screen.getByLabelText(/team size/i) as HTMLSelectElement;
        expect(select.value).toBe('6-20');
    });

    it('calls onChange when value changes', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step1TeamSize value={null} onChange={mockOnChange}/>);

        const select = screen.getByLabelText(/team size/i);
        await user.selectOptions(select, '6-20');

        expect(mockOnChange).toHaveBeenCalledWith('6-20');
    });

    it('displays error message when error prop provided', () => {
        const mockOnChange = vi.fn();
        render(<Step1TeamSize value={null} onChange={mockOnChange} error="Team size is required"/>);

        expect(screen.getByRole('alert')).toHaveTextContent('Team size is required');
    });

    it('applies error class when error exists', () => {
        const mockOnChange = vi.fn();
        render(<Step1TeamSize value={null} onChange={mockOnChange} error="Error message"/>);

        const select = screen.getByLabelText(/team size/i);
        expect(select).toHaveClass(styles.selectError);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
