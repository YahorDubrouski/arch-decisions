import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import {architectureDecisionStatus} from '@/domain/architecture-decision.js';
import type {RecommendationResult} from '@/domain/RecommendationCategory.js';
import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';

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

export class TemplateArchitectureDecisionProvider implements ArchitectureDecisionGenerator {
    async generate(
        context: ProjectContext,
        recommendations: RecommendationsResponse
    ): Promise<ArchitectureDecisionDraft> {
        return {
            title: 'Cloud Architecture Decisions',
            status: architectureDecisionStatus,
            content: buildArchitectureDecisionContent(context, recommendations),
            summary: buildArchitectureDecisionSummary(context, recommendations),
        };
    }
}
