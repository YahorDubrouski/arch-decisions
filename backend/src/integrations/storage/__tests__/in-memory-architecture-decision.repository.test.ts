import {InMemoryArchitectureDecisionRepository} from '@/integrations/storage/in-memory-architecture-decision.repository';
import {buildArchitectureDecision} from '@/test/fixtures/architecture-decision.fixture';

describe('InMemoryArchitectureDecisionRepository', () => {
    it('saves and finds architecture decisions by id', () => {
        const repository = new InMemoryArchitectureDecisionRepository();
        const architectureDecision = buildArchitectureDecision({id: 'decision-1'});

        repository.save(architectureDecision);

        expect(repository.findById('decision-1')).toEqual(architectureDecision);
    });

    it('returns null when architecture decision does not exist', () => {
        const repository = new InMemoryArchitectureDecisionRepository();

        expect(repository.findById('missing-id')).toBeNull();
    });
});
