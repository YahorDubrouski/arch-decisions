import {getArchitectureDecisionStorageProvider} from '@/config/storage.config.js';
import {getKnex} from '@/integrations/storage/knex.client.js';

if (getArchitectureDecisionStorageProvider() !== 'sqlite') {
    console.log('Skipping migration rollback: STORAGE_PROVIDER is not sqlite');
    process.exit(0);
}

const knex = getKnex();
await knex.migrate.rollback();
await knex.destroy();
