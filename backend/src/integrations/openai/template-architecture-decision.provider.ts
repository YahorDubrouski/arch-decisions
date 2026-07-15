import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import {architectureDecisionStatus} from '@/domain/architecture-decision.js';
import type {DecisionResult} from '@/domain/DecisionCategory.js';
import type {ProjectContext} from '@/domain/context.js';
import type {DecisionsResponse} from '@/domain/DecisionsResponse.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';

function formatDecisionSection(label: string, decision: DecisionResult): string {
    return `- **${label}:** ${decision.recommended}
  - Alternatives: ${decision.alternatives.join(', ')}
  - Trade-offs: cost ${decision.tradeOffs.cost}, complexity ${decision.tradeOffs.complexity}, risk ${decision.tradeOffs.risk}, operational overhead ${decision.tradeOffs.operationalOverhead}`;
}

function buildArchitectureDecisionContent(context: ProjectContext, decisions: DecisionsResponse): string {
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
${formatDecisionSection('Compute', decisions.compute)}

${formatDecisionSection('Secrets', decisions.secrets)}

${formatDecisionSection('CI/CD', decisions.cicd)}

## Consequences
- Aligns infrastructure choices with team size and operational maturity.
- Trade-offs balance cost, complexity, and compliance constraints.
- Recommended options reduce decision ambiguity for initial implementation.

## Alternatives Considered
- Compute alternatives: ${decisions.compute.alternatives.join(', ')}
- Secrets alternatives: ${decisions.secrets.alternatives.join(', ')}
- CI/CD alternatives: ${decisions.cicd.alternatives.join(', ')}

## Implementation Notes
- Validate recommendations against current cloud account standards.
- Revisit decisions when traffic patterns or compliance scope changes.`;
}

function buildArchitectureDecisionSummary(context: ProjectContext, decisions: DecisionsResponse): string {
    return `Proposed architecture for a ${context.teamSize} team: ${decisions.compute.recommended} (compute), ${decisions.secrets.recommended} (secrets), and ${decisions.cicd.recommended} (CI/CD), chosen for ${context.budgetSensitivity} budget profile and ${context.operationalMaturity} operational maturity.`;
}

export class TemplateArchitectureDecisionProvider implements ArchitectureDecisionGenerator {
    async generate(context: ProjectContext, decisions: DecisionsResponse): Promise<ArchitectureDecisionDraft> {
        return {
            title: 'Cloud Architecture Decisions',
            status: architectureDecisionStatus,
            content: buildArchitectureDecisionContent(context, decisions),
            summary: buildArchitectureDecisionSummary(context, decisions),
        };
    }
}
