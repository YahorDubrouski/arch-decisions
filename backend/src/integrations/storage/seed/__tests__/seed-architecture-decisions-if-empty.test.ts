import {architectureDecisionSeeds} from '@/integrations/storage/seed/architecture-decision.seeds';
import {seedArchitectureDecisionsIfEmpty} from '@/integrations/storage/seed/seed-architecture-decisions-if-empty';
import {InMemoryArchitectureDecisionRepository} from '@/integrations/storage/in-memory-architecture-decision.repository';
import {buildArchitectureDecision} from '@/test/fixtures/architecture-decision.fixture';

describe('seedArchitectureDecisionsIfEmpty', () => {
    /**
     * Given
     * - The repository has no architecture decisions.
     * When
     * - Demo seeds are applied.
     * Then
     * - All seed documents are inserted with expected titles.
     */
    it('when repository is empty then insert demo documents', () => {
        // Arrange
        const repository = new InMemoryArchitectureDecisionRepository();

        // Act
        seedArchitectureDecisionsIfEmpty(repository);

        // Assert
        const listed = repository.list();
        expect(listed).toHaveLength(architectureDecisionSeeds.length);
        expect(listed.map((item) => item.id).sort()).toEqual(
            [...architectureDecisionSeeds.map((seed) => seed.id)].sort()
        );
        expect(repository.findById('seed-startup-cost-optimized')?.title).toBe(
            'Startup cost-optimized stack'
        );
    });

    /**
     * Given
     * - The repository already contains a user-generated document.
     * When
     * - Demo seeds are applied more than once.
     * Then
     * - Missing seeds are added without overwriting existing documents.
     */
    it('when user documents exist then add missing seeds without overwriting', () => {
        // Arrange
        const repository = new InMemoryArchitectureDecisionRepository();
        repository.save(
            buildArchitectureDecision({
                id: 'user-generated-1',
                title: 'User generated ADR',
            })
        );

        // Act
        seedArchitectureDecisionsIfEmpty(repository);
        seedArchitectureDecisionsIfEmpty(repository);

        // Assert
        const listed = repository.list();
        expect(listed).toHaveLength(architectureDecisionSeeds.length + 1);
        expect(listed.some((item) => item.id === 'user-generated-1')).toBe(true);
        expect(repository.findById('seed-startup-cost-optimized')?.title).toBe(
            'Startup cost-optimized stack'
        );
    });

    /**
     * Given
     * - Demo seeds have been inserted.
     * When
     * - Documents are searched by title keywords.
     * Then
     * - Expected seeded documents appear in search results.
     */
    it('when seeds are inserted then support title search for the documents grid', () => {
        // Arrange
        const repository = new InMemoryArchitectureDecisionRepository();
        seedArchitectureDecisionsIfEmpty(repository);

        // Act
        const complianceHits = repository.list({search: 'compliance'});
        const eksHits = repository.list({search: 'EKS'});

        // Assert
        expect(complianceHits.length).toBeGreaterThanOrEqual(1);
        expect(complianceHits.some((item) => item.id === 'seed-enterprise-compliance')).toBe(true);
        expect(eksHits.length).toBeGreaterThanOrEqual(1);
        expect(eksHits.some((item) => item.id === 'seed-high-scale-eks')).toBe(true);
    });
});
