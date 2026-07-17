import type {
    ArchitectureDecision,
    ArchitectureDecisionListFilters,
    ArchitectureDecisionListItem,
} from '@/domain/architecture-decision.js';

export interface ArchitectureDecisionRepository {
    save(architectureDecision: ArchitectureDecision): void;
    findById(id: string): ArchitectureDecision | null;
    list(filters?: ArchitectureDecisionListFilters): ArchitectureDecisionListItem[];
}
