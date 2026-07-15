import {runSqliteMigrations} from '@/integrations/storage/run-sqlite-migrations';
import {destroyKnex} from '@/integrations/storage/knex.client';

describe('runSqliteMigrations', () => {
    const originalStorageProvider = process.env.STORAGE_PROVIDER;

    afterEach(async () => {
        await destroyKnex();

        if (originalStorageProvider === undefined) {
            delete process.env.STORAGE_PROVIDER;
        } else {
            process.env.STORAGE_PROVIDER = originalStorageProvider;
        }
    });

    it('skips migrations when storage provider is memory', async () => {
        process.env.STORAGE_PROVIDER = 'memory';

        await expect(runSqliteMigrations()).resolves.toBeUndefined();
    });
});
