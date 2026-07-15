import {getArchitectureDecisionStorageProvider} from '@/config/storage.config.js';
import type {ArchitectureDecisionRepository} from './architecture-decision-repository.js';
import {InMemoryArchitectureDecisionRepository} from './in-memory-architecture-decision.repository.js';
import {SqliteArchitectureDecisionRepository} from './sqlite-architecture-decision.repository.js';

export function createArchitectureDecisionRepository(): ArchitectureDecisionRepository {
    const storageProvider = getArchitectureDecisionStorageProvider();

    if (storageProvider === 'memory') {
        return new InMemoryArchitectureDecisionRepository();
    }

    return new SqliteArchitectureDecisionRepository();
}
