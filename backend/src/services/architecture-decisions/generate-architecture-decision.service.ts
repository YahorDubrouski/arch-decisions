import {randomUUID} from 'node:crypto';
import type {ArchitectureDecision} from '@/domain/architecture-decision.js';
import type {ProjectContext} from '@/domain/context.js';
import type {DecisionsResponse} from '@/domain/DecisionsResponse.js';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.js';
import type {ArchitectureDecisionGenerator} from './architecture-decision-generator.js';

export class GenerateArchitectureDecisionService {
    constructor(
        private readonly architectureDecisionGenerator: ArchitectureDecisionGenerator,
        private readonly architectureDecisionRepository: ArchitectureDecisionRepository
    ) {}

    async generate(
        context: ProjectContext,
        decisions: DecisionsResponse
    ): Promise<ArchitectureDecision> {
        const draft = await this.architectureDecisionGenerator.generate(context, decisions);
        const architectureDecision: ArchitectureDecision = {
            id: randomUUID(),
            title: draft.title,
            status: draft.status,
            content: draft.content,
            summary: draft.summary,
            createdAt: new Date().toISOString(),
        };

        this.architectureDecisionRepository.save(architectureDecision);
        return architectureDecision;
    }
}
