import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import {architectureDecisionStatus} from '@/domain/architecture-decision.js';
import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';

export function createTestMockArchitectureDecisionGenerator(): ArchitectureDecisionGenerator {
    return {
        async generate(
            context: ProjectContext,
            recommendations: RecommendationsResponse
        ): Promise<ArchitectureDecisionDraft> {
            return {
                title: 'Mock Architecture Decision Record',
                status: architectureDecisionStatus,
                summary: `Mock architecture decision for ${context.teamSize} team using ${recommendations.compute.recommended}.`,
                content: `# Mock Architecture Decision Record\n\nCompute: ${recommendations.compute.recommended}\nSecrets: ${recommendations.secrets.recommended}\nCI/CD: ${recommendations.cicd.recommended}`,
            };
        },
    };
}
