import {beforeEach, describe, expect, it, vi} from 'vitest';
import {act, renderHook, waitFor} from '@testing-library/react';
import {ReactNode} from 'react';
import {ProjectContext} from '@/domain/context';
import {RecommendationsResponse} from '@/domain/recommendations';
import {AppProviders} from '@/app/providers/AppProviders';
import {useEvaluateRecommendationsMutation} from '../useEvaluateRecommendationsMutation';

const mockNavigate = vi.fn();
const mockEvaluateRecommendations = vi.fn();
const mockSaveRecommendations = vi.fn();
const mockSaveProjectContext = vi.fn();

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

vi.mock('@/features/recommendations/gateways/recommendationsGateway', () => ({
    recommendationsGateway: {
        evaluateAll: (...args: unknown[]) => mockEvaluateRecommendations(...args),
    },
}));

vi.mock('@/features/recommendations/services/recommendationsStorage', () => ({
    saveRecommendations: (...args: unknown[]) => mockSaveRecommendations(...args),
}));

vi.mock('@/features/context/services/contextStorage', () => ({
    saveProjectContext: (...args: unknown[]) => mockSaveProjectContext(...args),
}));

function createWrapper() {
    return function Wrapper({children}: {children: ReactNode}) {
        return <AppProviders>{children}</AppProviders>;
    };
}

describe('useEvaluateRecommendationsMutation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Given
     * - Evaluation succeeds for a complete project context.
     * When
     * - submit is called on the mutation hook.
     * Then
     * - Context and recommendations are saved and navigation occurs.
     */
    it('saves recommendations and navigates on success', async () => {
        // Arrange
        mockEvaluateRecommendations.mockResolvedValue(sampleRecommendations);

        const {result} = renderHook(() => useEvaluateRecommendationsMutation(), {
            wrapper: createWrapper(),
        });

        // Act
        act(() => {
            result.current.submit(completeContext);
        });

        // Assert
        await waitFor(() => {
            expect(mockEvaluateRecommendations).toHaveBeenCalledWith(
                completeContext,
                expect.any(AbortSignal)
            );
            expect(mockSaveProjectContext).toHaveBeenCalledWith(completeContext);
            expect(mockSaveRecommendations).toHaveBeenCalledWith(sampleRecommendations);
            expect(mockNavigate).toHaveBeenCalledWith('/recommendations');
        });
    });

    /**
     * Given
     * - Evaluation fails with a network error.
     * When
     * - submit is called on the mutation hook.
     * Then
     * - A user-facing submit error is exposed.
     */
    it('exposes submit error when evaluation fails', async () => {
        // Arrange
        mockEvaluateRecommendations.mockRejectedValue(new TypeError('Failed to fetch'));

        const {result} = renderHook(() => useEvaluateRecommendationsMutation(), {
            wrapper: createWrapper(),
        });

        // Act
        act(() => {
            result.current.submit(completeContext);
        });

        // Assert
        await waitFor(() => {
            expect(result.current.submitError).toBe(
                'Could not reach the server. Check that backend is running.'
            );
        });
    });

    /**
     * Given
     * - An in-flight evaluation can be aborted.
     * When
     * - cancel is called while submission is pending.
     * Then
     * - Submitting stops without surfacing an abort error or navigating.
     */
    it('cancels in-flight evaluation without showing an abort error', async () => {
        // Arrange
        let rejectWithAbort: ((error: Error) => void) | undefined;
        mockEvaluateRecommendations.mockImplementation(
            (_context: ProjectContext, signal?: AbortSignal) =>
                new Promise((_resolve, reject) => {
                    rejectWithAbort = reject;
                    signal?.addEventListener('abort', () => {
                        reject(new DOMException('Aborted', 'AbortError'));
                    });
                })
        );

        const {result} = renderHook(() => useEvaluateRecommendationsMutation(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.submit(completeContext);
        });

        await waitFor(() => {
            expect(result.current.isSubmitting).toBe(true);
        });

        // Act
        act(() => {
            result.current.cancel();
        });

        // Assert
        await waitFor(() => {
            expect(result.current.isSubmitting).toBe(false);
            expect(result.current.submitError).toBeNull();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        void rejectWithAbort;
    });
});
