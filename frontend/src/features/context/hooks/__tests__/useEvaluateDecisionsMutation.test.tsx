import {beforeEach, describe, expect, it, vi} from 'vitest';
import {act, renderHook, waitFor} from '@testing-library/react';
import {ReactNode} from 'react';
import {ProjectContext} from '@/domain/context';
import {DecisionsResponse} from '@/domain/decisions';
import {AppProviders} from '@/app/providers/AppProviders';
import {useEvaluateDecisionsMutation} from '../useEvaluateDecisionsMutation';

const mockNavigate = vi.fn();
const mockEvaluateDecisions = vi.fn();
const mockSaveDecisions = vi.fn();
const mockSaveProjectContext = vi.fn();

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

vi.mock('@/features/context/services/decisionsService', () => ({
    evaluateDecisions: (...args: unknown[]) => mockEvaluateDecisions(...args),
}));

vi.mock('@/features/decisions/services/decisionsStorage', () => ({
    saveDecisions: (...args: unknown[]) => mockSaveDecisions(...args),
}));

vi.mock('@/features/context/services/contextStorage', () => ({
    saveProjectContext: (...args: unknown[]) => mockSaveProjectContext(...args),
}));

function createWrapper() {
    return function Wrapper({children}: {children: ReactNode}) {
        return <AppProviders>{children}</AppProviders>;
    };
}

describe('useEvaluateDecisionsMutation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('saves decisions and navigates on success', async () => {
        mockEvaluateDecisions.mockResolvedValue(sampleDecisions);

        const {result} = renderHook(() => useEvaluateDecisionsMutation(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.submit(completeContext);
        });

        await waitFor(() => {
            expect(mockEvaluateDecisions).toHaveBeenCalledWith(completeContext);
            expect(mockSaveProjectContext).toHaveBeenCalledWith(completeContext);
            expect(mockSaveDecisions).toHaveBeenCalledWith(sampleDecisions);
            expect(mockNavigate).toHaveBeenCalledWith('/decisions');
        });
    });

    it('exposes submit error when evaluation fails', async () => {
        mockEvaluateDecisions.mockRejectedValue(new TypeError('Failed to fetch'));

        const {result} = renderHook(() => useEvaluateDecisionsMutation(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.submit(completeContext);
        });

        await waitFor(() => {
            expect(result.current.submitError).toBe(
                'Could not reach the server. Check that backend is running.'
            );
        });
    });
});
