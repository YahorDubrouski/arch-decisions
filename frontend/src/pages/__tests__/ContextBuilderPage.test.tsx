import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ProjectContext} from '@/domain/context';
import {DecisionsResponse} from '@/domain/decisions';
import {renderWithProviders} from '@/test/renderWithProviders';
import {ContextBuilderPage} from '../ContextBuilderPage';

const mockNavigate = vi.fn();
const mockEvaluateDecisions = vi.fn();
const mockSaveDecisions = vi.fn();

const completeContext: ProjectContext = {
    teamSize: '6-20',
    trafficPattern: 'variable',
    budgetSensitivity: 'balanced',
    complianceRequirements: ['SOC2'],
    operationalMaturity: 'moderate',
};

const sampleDecisions: DecisionsResponse = {
    compute: {
        category: 'compute',
        recommended: 'ECS',
        alternatives: ['EC2'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'medium',
        },
    },
    secrets: {
        category: 'secrets',
        recommended: 'AWS Secrets Manager',
        alternatives: ['Vault'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
    cicd: {
        category: 'cicd',
        recommended: 'GitHub Actions',
        alternatives: ['GitLab CI'],
        tradeOffs: {
            cost: 'low',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
};

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/features/context/hooks/useContextForm', () => ({
    useContextForm: () => ({
        context: completeContext,
        updateContext: vi.fn(),
        currentStep: 5,
        nextStep: vi.fn(),
        previousStep: vi.fn(),
        errors: {},
        canSubmit: true,
    }),
}));

vi.mock('@/features/context/services/decisionsService', () => ({
    evaluateDecisions: (...args: unknown[]) => mockEvaluateDecisions(...args),
}));

vi.mock('@/features/decisions/services/decisionsStorage', () => ({
    saveDecisions: (...args: unknown[]) => mockSaveDecisions(...args),
}));

describe('ContextBuilderPage submit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows submitting state while evaluation is in progress', async () => {
        const user = userEvent.setup();
        let resolveEvaluation: (value: DecisionsResponse) => void = () => undefined;
        mockEvaluateDecisions.mockImplementation(
            () =>
                new Promise<DecisionsResponse>((resolve) => {
                    resolveEvaluation = resolve;
                })
        );

        renderWithProviders(<ContextBuilderPage/>);

        await user.click(screen.getByRole('button', {name: 'Evaluate decisions'}));

        expect(screen.getByRole('button', {name: 'Submitting…'})).toBeDisabled();
        expect(screen.getByRole('button', {name: 'Back'})).toBeDisabled();

        resolveEvaluation(sampleDecisions);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/decisions');
        });
    });

    it('shows error message when evaluation fails', async () => {
        const user = userEvent.setup();
        mockEvaluateDecisions.mockRejectedValue(new TypeError('Failed to fetch'));

        renderWithProviders(<ContextBuilderPage/>);

        await user.click(screen.getByRole('button', {name: 'Evaluate decisions'}));

        expect(
            await screen.findByRole('alert')
        ).toHaveTextContent('Could not reach the server. Check that backend is running.');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates to decisions page after successful evaluation', async () => {
        const user = userEvent.setup();
        mockEvaluateDecisions.mockResolvedValue(sampleDecisions);

        renderWithProviders(<ContextBuilderPage/>);

        await user.click(screen.getByRole('button', {name: 'Evaluate decisions'}));

        await waitFor(() => {
            expect(mockSaveDecisions).toHaveBeenCalledWith(sampleDecisions);
            expect(mockNavigate).toHaveBeenCalledWith('/decisions');
        });
    });
});
