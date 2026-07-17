import {architectureDecisionSeeds} from '@/features/architecture-decisions/seed/architectureDecisionSeeds';
import {
    getArchitectureDecisionById,
    saveArchitectureDecision,
} from '@/features/architecture-decisions/services/architectureDecisionStorage';

/**
 * Ensures catalog seed ADRs exist. Inserts missing seed ids only —
 * never overwrites user-generated or already-present seed documents.
 */
export function seedArchitectureDecisionsIfEmpty(): void {
    for (const seed of architectureDecisionSeeds) {
        if (!getArchitectureDecisionById(seed.id)) {
            saveArchitectureDecision(seed);
        }
    }
}
