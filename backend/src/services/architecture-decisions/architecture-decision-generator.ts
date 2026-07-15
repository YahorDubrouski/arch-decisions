import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import type {ProjectContext} from '@/domain/context.js';
import type {DecisionsResponse} from '@/domain/DecisionsResponse.js';

export interface ArchitectureDecisionGenerator {
    generate(context: ProjectContext, decisions: DecisionsResponse): Promise<ArchitectureDecisionDraft>;
}
