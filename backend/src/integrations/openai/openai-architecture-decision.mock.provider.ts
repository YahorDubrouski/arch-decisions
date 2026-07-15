import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import {architectureDecisionStatus} from '@/domain/architecture-decision.js';
import type {ProjectContext} from '@/domain/context.js';
import type {DecisionsResponse} from '@/domain/DecisionsResponse.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';

export function createTestMockArchitectureDecisionGenerator(): ArchitectureDecisionGenerator {
    return {
        async generate(context: ProjectContext, decisions: DecisionsResponse): Promise<ArchitectureDecisionDraft> {
            return {
                title: 'Mock Architecture Decision Record',
                status: architectureDecisionStatus,
                summary: `Mock architecture decision for ${context.teamSize} team using ${decisions.compute.recommended}.`,
                content: `# Mock Architecture Decision Record\n\nCompute: ${decisions.compute.recommended}\nSecrets: ${decisions.secrets.recommended}\nCI/CD: ${decisions.cicd.recommended}`,
            };
        },
    };
}
