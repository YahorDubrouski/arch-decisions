import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';

export interface ArchitectureDecisionGenerator {
    generate(context: ProjectContext, recommendations: RecommendationsResponse): Promise<ArchitectureDecisionDraft>;
}
