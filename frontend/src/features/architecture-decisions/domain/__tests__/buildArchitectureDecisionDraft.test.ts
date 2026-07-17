import {describe, expect, it} from 'vitest';
import type {ProjectContext} from '@/domain/context';
import type {RecommendationsResponse} from '@/domain/recommendations';
import {buildArchitectureDecisionDraft} from '../buildArchitectureDecisionDraft';

const context: ProjectContext = {
    teamSize: '6-20',
    trafficPattern: 'variable',
    budgetSensitivity: 'balanced',
    complianceRequirements: ['SOC2'],
    operationalMaturity: 'moderate',
};

const recommendations: RecommendationsResponse = {
    compute: {
        category: 'compute',
        recommended: 'ECS',
        alternatives: ['EKS', 'EC2'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
    secrets: {
        category: 'secrets',
        recommended: 'AWS Secrets Manager',
        alternatives: ['HashiCorp Vault'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
    cicd: {
        category: 'cicd',
        recommended: 'GitLab CI',
        alternatives: ['GitHub Actions'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'medium',
        },
    },
};

describe('buildArchitectureDecisionDraft', () => {
    /**
     * Given
     * - Project context and evaluated recommendations.
     * When
     * - An architecture decision draft is built.
     * Then
     * - Title, status, summary, and markdown content reflect the inputs.
     */
    it('builds title, summary, and markdown content from context and recommendations', () => {
        // Arrange
        // (shared context and recommendations fixtures)

        // Act
        const draft = buildArchitectureDecisionDraft(context, recommendations);

        // Assert
        expect(draft.title).toBe('Cloud Architecture Decisions');
        expect(draft.status).toBe('proposed');
        expect(draft.summary).toContain('ECS (compute)');
        expect(draft.summary).toContain('AWS Secrets Manager (secrets)');
        expect(draft.summary).toContain('GitLab CI (CI/CD)');
        expect(draft.content).toContain('## Decision');
        expect(draft.content).toContain('**Compute:** ECS');
        expect(draft.content).toContain('SOC2');
    });
});
