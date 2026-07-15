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

    it('lists architecture decisions newest first without content', () => {
        const repository = new InMemoryArchitectureDecisionRepository();
        repository.save(
            buildArchitectureDecision({
                id: 'older',
                title: 'Older decision',
                createdAt: '2026-01-01T00:00:00.000Z',
            })
        );
        repository.save(
            buildArchitectureDecision({
                id: 'newer',
                title: 'Newer decision',
                createdAt: '2026-02-01T00:00:00.000Z',
            })
        );

        expect(repository.list()).toEqual([
            {
                id: 'newer',
                title: 'Newer decision',
                status: 'proposed',
                summary: 'Summary text',
                createdAt: '2026-02-01T00:00:00.000Z',
            },
            {
                id: 'older',
                title: 'Older decision',
                status: 'proposed',
                summary: 'Summary text',
                createdAt: '2026-01-01T00:00:00.000Z',
            },
        ]);
    });
});

