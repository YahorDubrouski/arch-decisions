import type {
    ArchitectureDecision,
    ArchitectureDecisionListItem,
} from '@/domain/architecture-decision.js';
import type {ArchitectureDecisionRepository} from './architecture-decision-repository.js';

function toListItem(architectureDecision: ArchitectureDecision): ArchitectureDecisionListItem {
    return {
        id: architectureDecision.id,
        title: architectureDecision.title,
        status: architectureDecision.status,
        summary: architectureDecision.summary,
        createdAt: architectureDecision.createdAt,
    };
}

export class InMemoryArchitectureDecisionRepository implements ArchitectureDecisionRepository {
    private readonly records = new Map<string, ArchitectureDecision>();

    save(architectureDecision: ArchitectureDecision): void {
        this.records.set(architectureDecision.id, architectureDecision);
    }

    findById(id: string): ArchitectureDecision | null {
        return this.records.get(id) ?? null;
    }

    list(): ArchitectureDecisionListItem[] {
        return [...this.records.values()]
            .map(toListItem)
            .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    }
}
