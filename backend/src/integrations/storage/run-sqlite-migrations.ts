import {getArchitectureDecisionStorageProvider} from '@/config/storage.config.js';
import {getKnex} from './knex.client.js';

export async function runSqliteMigrations(): Promise<void> {
    if (getArchitectureDecisionStorageProvider() !== 'sqlite') {
        return;
    }

    const knex = getKnex();
    await knex.migrate.latest();
}
