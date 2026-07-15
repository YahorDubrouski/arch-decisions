import {createArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.factory';
import {InMemoryArchitectureDecisionRepository} from '@/integrations/storage/in-memory-architecture-decision.repository';
import {SqliteArchitectureDecisionRepository} from '@/integrations/storage/sqlite-architecture-decision.repository';

describe('createArchitectureDecisionRepository', () => {
    const originalStorageProvider = process.env.STORAGE_PROVIDER;

    afterEach(() => {
        if (originalStorageProvider === undefined) {
            delete process.env.STORAGE_PROVIDER;
        } else {
            process.env.STORAGE_PROVIDER = originalStorageProvider;
        }
    });

    it('creates sqlite repository by default', () => {
        delete process.env.STORAGE_PROVIDER;

        const repository = createArchitectureDecisionRepository();

        expect(repository).toBeInstanceOf(SqliteArchitectureDecisionRepository);
    });

    it('creates sqlite repository when STORAGE_PROVIDER is sqlite', () => {
        process.env.STORAGE_PROVIDER = 'sqlite';

        const repository = createArchitectureDecisionRepository();

        expect(repository).toBeInstanceOf(SqliteArchitectureDecisionRepository);
    });

    it('creates in-memory repository when STORAGE_PROVIDER is memory', () => {
        process.env.STORAGE_PROVIDER = 'memory';

        const repository = createArchitectureDecisionRepository();

        expect(repository).toBeInstanceOf(InMemoryArchitectureDecisionRepository);
    });
});
