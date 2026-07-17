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

    /**
     * Given
     * - STORAGE_PROVIDER is unset.
     * When
     * - The architecture decision repository is created.
     * Then
     * - A SQLite repository is returned.
     */
    it('when storage provider is unset then create sqlite repository', () => {
        // Arrange
        delete process.env.STORAGE_PROVIDER;

        // Act
        const repository = createArchitectureDecisionRepository();

        // Assert
        expect(repository).toBeInstanceOf(SqliteArchitectureDecisionRepository);
    });

    /**
     * Given
     * - STORAGE_PROVIDER is sqlite.
     * When
     * - The architecture decision repository is created.
     * Then
     * - A SQLite repository is returned.
     */
    it('when storage provider is sqlite then create sqlite repository', () => {
        // Arrange
        process.env.STORAGE_PROVIDER = 'sqlite';

        // Act
        const repository = createArchitectureDecisionRepository();

        // Assert
        expect(repository).toBeInstanceOf(SqliteArchitectureDecisionRepository);
    });

    /**
     * Given
     * - STORAGE_PROVIDER is memory.
     * When
     * - The architecture decision repository is created.
     * Then
     * - An in-memory repository is returned.
     */
    it('when storage provider is memory then create in-memory repository', () => {
        // Arrange
        process.env.STORAGE_PROVIDER = 'memory';

        // Act
        const repository = createArchitectureDecisionRepository();

        // Assert
        expect(repository).toBeInstanceOf(InMemoryArchitectureDecisionRepository);
    });
});
