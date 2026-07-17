import {afterEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {RecommendationsResponse} from '@/domain/recommendations';
import {ProjectContext} from '@/domain/context';
import {clearProjectContext, saveProjectContext} from '@/features/context/services/contextStorage';
import {clearRecommendations, saveRecommendations} from '@/features/recommendations/services/recommendationsStorage';
import {RecommendationsPage} from '../RecommendationsPage';

const mockSubmit = vi.fn();
const mockCancel = vi.fn();
const mockResetSubmitError = vi.fn();
let mockIsSubmitting = false;

vi.mock('@/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation', () => ({
    useGenerateArchitectureDecisionMutation: () => ({
        submit: mockSubmit,
        cancel: mockCancel,
        isSubmitting: mockIsSubmitting,
        submitError: null,
        resetSubmitError: mockResetSubmitError,
    }),
}));

const sampleContext: ProjectContext = {
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

describe('RecommendationsPage', () => {
    afterEach(() => {
        clearRecommendations();
        clearProjectContext();
        mockIsSubmitting = false;
        vi.clearAllMocks();
    });

    /**
     * Given
     * - No recommendations are stored in session.
     * When
     * - The recommendations page is opened.
     * Then
     * - An empty state guides the user to the context workflow.
     */
    it('renders empty state with a context workflow CTA when no recommendations are stored', () => {
        // Arrange
        // (no stored recommendations)

        // Act
        render(
            <MemoryRouter>
                <RecommendationsPage/>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('heading', {name: /recommendations/i})).toBeInTheDocument();
        expect(screen.getByText(/no recommendations yet/i)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: /start context workflow/i})).toHaveAttribute('href', '/context');
        expect(screen.getByRole('link', {name: /go to context/i})).toHaveAttribute('href', '/context');
        expect(screen.queryByRole('button', {name: /generate architecture decision/i})).not.toBeInTheDocument();
    });

    it('renders recommendation cards when recommendations are stored', () => {
        // Arrange
        saveRecommendations(sampleRecommendations);

        // Act
        render(
            <MemoryRouter>
                <RecommendationsPage/>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('heading', {name: 'Compute'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Secrets'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'CI/CD'})).toBeInTheDocument();
        expect(screen.getByText('ECS')).toBeInTheDocument();
    });

    /**
     * Given
     * - Stored recommendations and complete project context.
     * When
     * - The user generates an architecture decision.
     * Then
     * - Generation is submitted with context and recommendations.
     */
    it('submits architecture decision generation when context and recommendations exist', async () => {
        // Arrange
        const user = userEvent.setup();
        saveRecommendations(sampleRecommendations);
        saveProjectContext(sampleContext);
        render(
            <MemoryRouter>
                <RecommendationsPage/>
            </MemoryRouter>
        );

        // Act
        await user.click(screen.getByRole('button', {name: /generate architecture decision/i}));

        // Assert
        await waitFor(() => {
            expect(mockResetSubmitError).toHaveBeenCalled();
            expect(mockSubmit).toHaveBeenCalledWith({
                context: sampleContext,
                recommendations: sampleRecommendations,
            });
        });
    });

    /**
     * Given
     * - Recommendations exist but project context is missing.
     * When
     * - The recommendations page is opened.
     * Then
     * - Generate is disabled and a missing-context message is shown.
     */
    it('disables generate button when project context is missing', () => {
        // Arrange
        saveRecommendations(sampleRecommendations);

        // Act
        render(
            <MemoryRouter>
                <RecommendationsPage/>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('button', {name: /generate architecture decision/i})).toBeDisabled();
        expect(screen.getByText(/project context is missing/i)).toBeInTheDocument();
    });

    it('renders edit-context navigation when recommendations exist', () => {
        // Arrange
        saveRecommendations(sampleRecommendations);

        // Act
        render(
            <MemoryRouter>
                <RecommendationsPage/>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('link', {name: /edit context/i})).toHaveAttribute('href', '/context');
        expect(screen.getByRole('link', {name: /home/i})).toHaveAttribute('href', '/');
    });

    /**
     * Given
     * - Architecture decision generation is in progress.
     * When
     * - The user clicks cancel.
     * Then
     * - The in-flight generation is cancelled.
     */
    it('shows cancel while generating and calls cancel on click', async () => {
        // Arrange
        const user = userEvent.setup();
        mockIsSubmitting = true;
        saveRecommendations(sampleRecommendations);
        saveProjectContext(sampleContext);
        render(
            <MemoryRouter>
                <RecommendationsPage/>
            </MemoryRouter>
        );

        // Act
        await user.click(screen.getByRole('button', {name: /cancel/i}));

        // Assert
        expect(mockCancel).toHaveBeenCalled();
    });
});
