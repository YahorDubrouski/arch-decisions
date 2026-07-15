import {afterEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {DecisionsResponse} from '@/domain/decisions';
import {ProjectContext} from '@/domain/context';
import {clearProjectContext, saveProjectContext} from '@/features/context/services/contextStorage';
import {clearDecisions, saveDecisions} from '@/features/decisions/services/decisionsStorage';
import {DecisionsPage} from '../DecisionsPage';

const mockSubmit = vi.fn();
const mockResetSubmitError = vi.fn();

vi.mock('@/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation', () => ({
    useGenerateArchitectureDecisionMutation: () => ({
        submit: mockSubmit,
        isSubmitting: false,
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

describe('DecisionsPage', () => {
    afterEach(() => {
        clearDecisions();
        clearProjectContext();
        vi.clearAllMocks();
    });

    it('renders empty state when no decisions are stored', () => {
        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {name: /architecture decisions/i})).toBeInTheDocument();
        expect(screen.getByText(/no decisions yet/i)).toBeInTheDocument();
    });

    it('renders decision cards when decisions are stored', () => {
        saveDecisions(sampleDecisions);

        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {name: 'Compute'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Secrets'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'CI/CD'})).toBeInTheDocument();
        expect(screen.getByText('ECS')).toBeInTheDocument();
    });

    it('submits architecture decision generation when context and decisions exist', async () => {
        const user = userEvent.setup();
        saveDecisions(sampleDecisions);
        saveProjectContext(sampleContext);

        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', {name: /generate architecture decision/i}));

        await waitFor(() => {
            expect(mockResetSubmitError).toHaveBeenCalled();
            expect(mockSubmit).toHaveBeenCalledWith({
                context: sampleContext,
                decisions: sampleDecisions,
            });
        });
    });

    it('disables generate button when project context is missing', () => {
        saveDecisions(sampleDecisions);

        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('button', {name: /generate architecture decision/i})).toBeDisabled();
        expect(screen.getByText(/project context is missing/i)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('link', {name: /edit context/i})).toHaveAttribute('href', '/context');
        expect(screen.getByRole('link', {name: /home/i})).toHaveAttribute('href', '/');
    });
});
