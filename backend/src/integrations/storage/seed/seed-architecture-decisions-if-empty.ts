import logger from '@/lib/logging/logger.js';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.js';
import {architectureDecisionSeeds} from './architecture-decision.seeds.js';

/**
 * Ensures catalog seed ADRs exist. Inserts missing seed ids only —
 * never overwrites user-generated or already-present seed documents.
 */
export function seedArchitectureDecisionsIfEmpty(
    architectureDecisionRepository: ArchitectureDecisionRepository
): void {
    const insertedIds: string[] = [];

    for (const seed of architectureDecisionSeeds) {
        if (!architectureDecisionRepository.findById(seed.id)) {
            architectureDecisionRepository.save(seed);
            insertedIds.push(seed.id);
        }
    }

    if (insertedIds.length > 0) {
        logger.info('Seeded demo architecture decisions', {
            count: insertedIds.length,
            ids: insertedIds,
        });
    }
}
