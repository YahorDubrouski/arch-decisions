import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Step4ComplianceRequirements} from '../Step4ComplianceRequirements';

describe('Step4ComplianceRequirements', () => {
    it('renders compliance checkboxes', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step4ComplianceRequirements value={[]} onChange={mockOnChange}/>);

        // Assert
        expect(screen.getByText('Compliance Requirements')).toBeInTheDocument();
        expect(screen.getByLabelText('SOC2')).toBeInTheDocument();
        expect(screen.getByLabelText('GDPR')).toBeInTheDocument();
    });

    it('displays selected values', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(<Step4ComplianceRequirements value={['SOC2', 'GDPR']} onChange={mockOnChange}/>);

        // Assert
        expect(screen.getByLabelText('SOC2')).toBeChecked();
        expect(screen.getByLabelText('GDPR')).toBeChecked();
        expect(screen.getByLabelText('HIPAA')).not.toBeChecked();
    });

    it('when user checks a requirement then it is added to the selection', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step4ComplianceRequirements value={['SOC2']} onChange={mockOnChange}/>);

        // Act
        await user.click(screen.getByLabelText('HIPAA'));

        // Assert
        expect(mockOnChange).toHaveBeenCalledWith(['SOC2', 'HIPAA']);
    });

    it('when user unchecks a requirement then it is removed from the selection', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<Step4ComplianceRequirements value={['SOC2', 'HIPAA']} onChange={mockOnChange}/>);

        // Act
        await user.click(screen.getByLabelText('HIPAA'));

        // Assert
        expect(mockOnChange).toHaveBeenCalledWith(['SOC2']);
    });

    it('displays error message when error prop provided', () => {
        // Arrange
        const mockOnChange = vi.fn();

        // Act
        render(
            <Step4ComplianceRequirements
                value={[]}
                onChange={mockOnChange}
                error="Select at least one compliance requirement"
            />
        );

        // Assert
        expect(screen.getByRole('alert')).toHaveTextContent('Select at least one compliance requirement');
    });
});
