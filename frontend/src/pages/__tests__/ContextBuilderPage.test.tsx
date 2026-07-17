import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ProjectContext} from '@/domain/context';
import {RecommendationsResponse} from '@/domain/recommendations';
import {renderWithProviders} from '@/test/renderWithProviders';
import {ContextBuilderPage} from '../ContextBuilderPage';

const mockNavigate = vi.fn();
const mockEvaluateRecommendations = vi.fn();
const mockSaveRecommendations = vi.fn();

const completeContext: ProjectContext = {
    teamSize: '6-20',
    trafficPattern: 'variable',
    budgetSensitivity: 'balanced',
    complianceRequirements: ['SOC2'],
    operationalMaturity: 'moderate',
};

const sampleRecommendations: RecommendationsResponse = {
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

vi.mock('@/features/recommendations/gateways/recommendationsGateway', () => ({
    recommendationsGateway: {
        evaluateAll: (...args: unknown[]) => mockEvaluateRecommendations(...args),
    },
}));

vi.mock('@/features/recommendations/services/recommendationsStorage', () => ({
    saveRecommendations: (...args: unknown[]) => mockSaveRecommendations(...args),
}));

describe('ContextBuilderPage submit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Given
     * - Evaluation is in progress after submit.
     * When
     * - The user clicks Evaluate recommendations.
     * Then
     * - Submit and back controls are disabled until navigation succeeds.
     */
    it('shows submitting state while evaluation is in progress', async () => {
        // Arrange
        const user = userEvent.setup();
        let resolveEvaluation: (value: RecommendationsResponse) => void = () => undefined;
        mockEvaluateRecommendations.mockImplementation(
            () =>
                new Promise<RecommendationsResponse>((resolve) => {
                    resolveEvaluation = resolve;
                })
        );

        renderWithProviders(<ContextBuilderPage/>);

        // Act
        await user.click(screen.getByRole('button', {name: 'Evaluate recommendations'}));

        // Assert
        expect(screen.getByRole('button', {name: 'Submitting…'})).toBeDisabled();
        expect(screen.getByRole('button', {name: 'Back'})).toBeDisabled();

        resolveEvaluation(sampleRecommendations);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/recommendations');
        });
    });

    /**
     * Given
     * - Recommendation evaluation fails with a network error.
     * When
     * - The user submits the context form.
     * Then
     * - An alert is shown and navigation does not occur.
     */
    it('shows error message when evaluation fails', async () => {
        // Arrange
        const user = userEvent.setup();
        mockEvaluateRecommendations.mockRejectedValue(new TypeError('Failed to fetch'));

        renderWithProviders(<ContextBuilderPage/>);

        // Act
        await user.click(screen.getByRole('button', {name: 'Evaluate recommendations'}));

        // Assert
        expect(
            await screen.findByRole('alert')
        ).toHaveTextContent('Could not reach the server. Check that backend is running.');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    /**
     * Given
     * - Recommendation evaluation succeeds.
     * When
     * - The user submits the context form.
     * Then
     * - Recommendations are saved and the app navigates to the results page.
     */
    it('navigates to recommendations page after successful evaluation', async () => {
        // Arrange
        const user = userEvent.setup();
        mockEvaluateRecommendations.mockResolvedValue(sampleRecommendations);

        renderWithProviders(<ContextBuilderPage/>);

        // Act
        await user.click(screen.getByRole('button', {name: 'Evaluate recommendations'}));

        // Assert
        await waitFor(() => {
            expect(mockSaveRecommendations).toHaveBeenCalledWith(sampleRecommendations);
            expect(mockNavigate).toHaveBeenCalledWith('/recommendations');
        });
    });
});
