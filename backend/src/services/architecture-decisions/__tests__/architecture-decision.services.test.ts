import {GenerateArchitectureDecisionService} from '@/services/architecture-decisions/generate-architecture-decision.service';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository';
import {InMemoryArchitectureDecisionRepository} from '@/integrations/storage/in-memory-architecture-decision.repository';
import {createTestMockArchitectureDecisionGenerator} from '@/integrations/openai/openai-architecture-decision.mock.provider';
import {buildDecisionsResponse} from '@/test/fixtures/decisions-response.fixture';
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

    it('generates and persists an architecture decision record', async () => {
        const result = await service.generate(buildProjectContext(), buildDecisionsResponse());

        expect(result.id).toBeTruthy();
        expect(result.title).toBe('Mock Architecture Decision Record');
        expect(result.status).toBe('proposed');
        expect(result.content).toContain('Compute: ECS');
        expect(result.summary).toContain('6-20');
        expect(repository.findById(result.id)).toEqual(result);
    });
});
