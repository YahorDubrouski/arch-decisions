import type {ProjectContext} from '@/domain/context';
import type {RecommendationResult, RecommendationsResponse} from '@/domain/recommendations';

export type ArchitectureDecisionDraft = {
    title: string;
    status: 'proposed';
    content: string;
    summary: string;
};

function formatRecommendationSection(label: string, recommendation: RecommendationResult): string {
    return `- **${label}:** ${recommendation.recommended}
  - Alternatives: ${recommendation.alternatives.join(', ')}
  - Trade-offs: cost ${recommendation.tradeOffs.cost}, complexity ${recommendation.tradeOffs.complexity}, risk ${recommendation.tradeOffs.risk}, operational overhead ${recommendation.tradeOffs.operationalOverhead}`;
}

function buildArchitectureDecisionContent(
    context: ProjectContext,
    recommendations: RecommendationsResponse
): string {
    return `# Architecture Decision Record

## Status
proposed

## Context
- Team size: ${context.teamSize}
- Traffic pattern: ${context.trafficPattern}
- Budget sensitivity: ${context.budgetSensitivity}
- Compliance requirements: ${context.complianceRequirements.join(', ') || 'none'}
- Operational maturity: ${context.operationalMaturity}

## Decision
${formatRecommendationSection('Compute', recommendations.compute)}

${formatRecommendationSection('Secrets', recommendations.secrets)}

${formatRecommendationSection('CI/CD', recommendations.cicd)}

## Consequences
- Aligns infrastructure choices with team size and operational maturity.
- Trade-offs balance cost, complexity, and compliance constraints.
- Recommended options reduce decision ambiguity for initial implementation.

## Alternatives Considered
- Compute alternatives: ${recommendations.compute.alternatives.join(', ')}
- Secrets alternatives: ${recommendations.secrets.alternatives.join(', ')}
- CI/CD alternatives: ${recommendations.cicd.alternatives.join(', ')}

## Implementation Notes
- Validate recommendations against current cloud account standards.
- Revisit decisions when traffic patterns or compliance scope changes.`;
}

function buildArchitectureDecisionSummary(
    context: ProjectContext,
    recommendations: RecommendationsResponse
): string {
    return `Proposed architecture for a ${context.teamSize} team: ${recommendations.compute.recommended} (compute), ${recommendations.secrets.recommended} (secrets), and ${recommendations.cicd.recommended} (CI/CD), chosen for ${context.budgetSensitivity} budget profile and ${context.operationalMaturity} operational maturity.`;
}

/**
 * Deterministic ADR draft (mirrors backend template generator).
 */
export function buildArchitectureDecisionDraft(
    context: ProjectContext,
    recommendations: RecommendationsResponse
): ArchitectureDecisionDraft {
    return {
        title: 'Cloud Architecture Decisions',
        status: 'proposed',
        content: buildArchitectureDecisionContent(context, recommendations),
        summary: buildArchitectureDecisionSummary(context, recommendations),
    };
}
