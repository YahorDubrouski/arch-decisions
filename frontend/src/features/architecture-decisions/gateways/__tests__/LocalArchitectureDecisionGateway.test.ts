import {afterEach, describe, expect, it} from 'vitest';
import {architectureDecisionSeeds} from '@/features/architecture-decisions/seed/architectureDecisionSeeds';
import {
    clearArchitectureDecision,
    getArchitectureDecisionById,
    saveArchitectureDecision,
} from '@/features/architecture-decisions/services/architectureDecisionStorage';
import {createLocalArchitectureDecisionGateway} from '../LocalArchitectureDecisionGateway';
import {ArchitectureDecision} from '@/domain/architectureDecision';

const userDecision: ArchitectureDecision = {
    id: 'user-generated-1',
    title: 'User generated ADR',
    status: 'proposed',
    content: '# User ADR',
    summary: 'Created by the user about serverless',
    createdAt: '2026-02-01T00:00:00.000Z',
};

const generateRequest = {
    context: {
        teamSize: '6-20' as const,
        trafficPattern: 'variable' as const,
        budgetSensitivity: 'balanced' as const,
        complianceRequirements: ['SOC2'],
        operationalMaturity: 'moderate' as const,
    },
    recommendations: {
        compute: {
            category: 'compute' as const,
            recommended: 'ECS',
            alternatives: ['EKS'],
            tradeOffs: {
                cost: 'medium' as const,
                complexity: 'medium' as const,
                risk: 'low' as const,
                operationalOverhead: 'low' as const,
            },
        },
        secrets: {
            category: 'secrets' as const,
            recommended: 'AWS Secrets Manager',
            alternatives: ['Vault'],
            tradeOffs: {
                cost: 'medium' as const,
                complexity: 'low' as const,
                risk: 'low' as const,
                operationalOverhead: 'low' as const,
            },
        },
        cicd: {
            category: 'cicd' as const,
            recommended: 'GitHub Actions',
            alternatives: ['GitLab CI'],
            tradeOffs: {
                cost: 'low' as const,
                complexity: 'low' as const,
                risk: 'low' as const,
                operationalOverhead: 'low' as const,
            },
        },
    },
};

describe('createLocalArchitectureDecisionGateway', () => {
    const generatedIds: string[] = [];

    afterEach(() => {
        for (const seed of architectureDecisionSeeds) {
            clearArchitectureDecision(seed.id);
        }
        clearArchitectureDecision(userDecision.id);
        for (const id of generatedIds) {
            clearArchitectureDecision(id);
        }
        generatedIds.length = 0;
    });

    /**
     * Given
     * - A fresh local gateway with seeded catalog documents.
     * When
     * - Documents are listed with and without a search term.
     * Then
     * - All seeds are returned and compliance-related search finds the enterprise seed.
     */
    it('lists seeded documents and supports search', async () => {
        // Arrange
        const gateway = createLocalArchitectureDecisionGateway();

        // Act
        const listed = await gateway.list();
        const complianceHits = await gateway.list({search: 'compliance'});

        // Assert
        expect(listed).toHaveLength(architectureDecisionSeeds.length);
        expect(complianceHits.length).toBeGreaterThanOrEqual(1);
        expect(complianceHits.some((item) => item.id === 'seed-enterprise-compliance')).toBe(true);
    });

    /**
     * Given
     * - A seeded serverless MVP document exists in storage.
     * When
     * - The document is fetched by id.
     * Then
     * - The expected title is returned.
     */
    it('returns a document by id after seeding', async () => {
        // Arrange
        const gateway = createLocalArchitectureDecisionGateway();

        // Act
        const decision = await gateway.getById('seed-serverless-mvp');

        // Assert
        expect(decision.title).toBe('Serverless MVP for small teams');
    });

    /**
     * Given
     * - A user-generated document already exists in storage.
     * When
     * - The local gateway is created and documents are listed.
     * Then
     * - User content is preserved and missing catalog seeds are still inserted.
     */
    it('keeps user documents and still inserts missing catalog seeds', async () => {
        // Arrange
        saveArchitectureDecision(userDecision);
        const gateway = createLocalArchitectureDecisionGateway();

        // Act
        const listed = await gateway.list();

        // Assert
        expect(listed.some((item) => item.id === userDecision.id)).toBe(true);
        expect(listed).toHaveLength(architectureDecisionSeeds.length + 1);
        expect(getArchitectureDecisionById(userDecision.id)?.summary).toBe(userDecision.summary);
    });

    /**
     * Given
     * - Project context and recommendations for template generation.
     * When
     * - A new architecture decision is generated through the gateway.
     * Then
     * - The draft is persisted and readable by id from storage and the gateway.
     */
    it('generates a template ADR and persists it in sessionStorage', async () => {
        // Arrange
        const gateway = createLocalArchitectureDecisionGateway();

        // Act
        const architectureDecision = await gateway.generate(generateRequest);
        generatedIds.push(architectureDecision.id);

        // Assert
        expect(architectureDecision.title).toBe('Cloud Architecture Decisions');
        expect(architectureDecision.content).toContain('**Compute:** ECS');
        expect(architectureDecision.summary).toContain('ECS (compute)');
        expect(getArchitectureDecisionById(architectureDecision.id)).toEqual(architectureDecision);
        expect(await gateway.getById(architectureDecision.id)).toEqual(architectureDecision);
    });

    /**
     * Given
     * - A local gateway and an already-aborted abort signal.
     * When
     * - Documents are listed with that signal.
     * Then
     * - The request rejects with an AbortError.
     */
    it('rejects when the signal is already aborted', async () => {
        // Arrange
        const gateway = createLocalArchitectureDecisionGateway();
        const controller = new AbortController();
        controller.abort();

        // Act & Assert
        await expect(gateway.list({}, controller.signal)).rejects.toMatchObject({
            name: 'AbortError',
        });
    });
});
