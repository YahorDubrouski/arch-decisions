import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step4ComplianceRequirements} from '../Step4ComplianceRequirements';

describe('Step4ComplianceRequirements', () => {
    it('renders compliance checkboxes', () => {
        const mockOnChange = vi.fn();
        render(<Step4ComplianceRequirements value={[]} onChange={mockOnChange}/>);

        expect(screen.getByText('Compliance Requirements')).toBeInTheDocument();
        expect(screen.getByLabelText('SOC2')).toBeInTheDocument();
        expect(screen.getByLabelText('GDPR')).toBeInTheDocument();
    });

    it('displays selected values', () => {
        const mockOnChange = vi.fn();
        render(<Step4ComplianceRequirements value={['SOC2', 'GDPR']} onChange={mockOnChange}/>);

        expect(screen.getByLabelText('SOC2')).toBeChecked();
        expect(screen.getByLabelText('GDPR')).toBeChecked();
        expect(screen.getByLabelText('HIPAA')).not.toBeChecked();
    });

    it('adds requirement when checkbox is checked', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step4ComplianceRequirements value={['SOC2']} onChange={mockOnChange}/>);

        await user.click(screen.getByLabelText('HIPAA'));

        expect(mockOnChange).toHaveBeenCalledWith(['SOC2', 'HIPAA']);
    });

    it('removes requirement when checkbox is unchecked', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step4ComplianceRequirements value={['SOC2', 'HIPAA']} onChange={mockOnChange}/>);

        await user.click(screen.getByLabelText('HIPAA'));

        expect(mockOnChange).toHaveBeenCalledWith(['SOC2']);
    });

    it('displays error message when error prop provided', () => {
        const mockOnChange = vi.fn();
        render(
            <Step4ComplianceRequirements
                value={[]}
                onChange={mockOnChange}
                error="Select at least one compliance requirement"
            />
        );

        expect(screen.getByRole('alert')).toHaveTextContent('Select at least one compliance requirement');
    });
});
