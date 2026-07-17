import {InMemoryArchitectureDecisionRepository} from '@/integrations/storage/in-memory-architecture-decision.repository';
import {buildArchitectureDecision} from '@/test/fixtures/architecture-decision.fixture';

describe('InMemoryArchitectureDecisionRepository', () => {
    it('saves and finds architecture decisions by id', () => {
        // Arrange
        const repository = new InMemoryArchitectureDecisionRepository();
        const architectureDecision = buildArchitectureDecision({id: 'decision-1'});

        // Act
        repository.save(architectureDecision);
        const found = repository.findById('decision-1');

        // Assert
        expect(found).toEqual(architectureDecision);
    });

    it('returns null when architecture decision does not exist', () => {
        // Arrange
        const repository = new InMemoryArchitectureDecisionRepository();

        // Act
        const found = repository.findById('missing-id');

        // Assert
        expect(found).toBeNull();
    });

    /**
     * Given
     * - Multiple architecture decisions with different creation dates.
     * When
     * - Decisions are listed without content.
     * Then
     * - Newest decisions appear first.
     */
    it('when multiple decisions exist then list newest first without content', () => {
        // Arrange
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

        // Act
        const listed = repository.list();

        // Assert
        expect(listed).toEqual([
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

    /**
     * Given
     * - Architecture decisions with distinct titles and summaries.
     * When
     * - Decisions are listed with a search filter.
     * Then
     * - Only matching decisions are returned.
     */
    it('when search filter is applied then return matching decisions', () => {
        // Arrange
        const repository = new InMemoryArchitectureDecisionRepository();
        repository.save(
            buildArchitectureDecision({
                id: 'ecs',
                title: 'ECS decision',
                summary: 'Use containers',
            })
        );
        repository.save(
            buildArchitectureDecision({
                id: 'ec2',
                title: 'EC2 decision',
                summary: 'Use VMs',
            })
        );

        // Act
        const listed = repository.list({search: 'ecs'});

        // Assert
        expect(listed).toEqual([
            expect.objectContaining({id: 'ecs', title: 'ECS decision'}),
        ]);
    });
});
