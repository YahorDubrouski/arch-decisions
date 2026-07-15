import type {ArchitectureDecision} from '@/domain/architecture-decision.js';
import type {ArchitectureDecisionRepository} from './architecture-decision-repository.js';

export class InMemoryArchitectureDecisionRepository implements ArchitectureDecisionRepository {
    private readonly records = new Map<string, ArchitectureDecision>();

    save(architectureDecision: ArchitectureDecision): void {
        this.records.set(architectureDecision.id, architectureDecision);
    }

    findById(id: string): ArchitectureDecision | null {
        return this.records.get(id) ?? null;
    }
}
