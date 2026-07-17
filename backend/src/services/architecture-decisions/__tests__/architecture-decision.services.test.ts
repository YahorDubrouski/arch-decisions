import {GenerateArchitectureDecisionService} from '@/services/architecture-decisions/generate-architecture-decision.service';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository';
import {InMemoryArchitectureDecisionRepository} from '@/integrations/storage/in-memory-architecture-decision.repository';
import {createTestMockArchitectureDecisionGenerator} from '@/integrations/openai/openai-architecture-decision.mock.provider';
import {buildRecommendationsResponse} from '@/test/fixtures/recommendations-response.fixture';
import {buildProjectContext} from '@/test/fixtures/project-context.fixture';

function createTestRepository(): ArchitectureDecisionRepository {
    return new InMemoryArchitectureDecisionRepository();
}

describe('GenerateArchitectureDecisionService', () => {
    let repository: ArchitectureDecisionRepository;
    let service: GenerateArchitectureDecisionService;

    beforeEach(() => {
        repository = createTestRepository();
        service = new GenerateArchitectureDecisionService(
            createTestMockArchitectureDecisionGenerator(),
            repository
        );
    });

    /**
     * Given
     * - Project context and recommendation decisions.
     * When
     * - An architecture decision is generated.
     * Then
     * - A persisted record with expected content is returned.
     */
    it('when context and recommendations are provided then generate and persist record', async () => {
        // Arrange
        const context = buildProjectContext();
        const recommendations = buildRecommendationsResponse();

        // Act
        const result = await service.generate(context, recommendations);

        // Assert
        expect(result.id).toBeTruthy();
        expect(result.title).toBe('Mock Architecture Decision Record');
        expect(result.status).toBe('proposed');
        expect(result.content).toContain('Compute: ECS');
        expect(result.summary).toContain('6-20');
        expect(repository.findById(result.id)).toEqual(result);
    });
});
