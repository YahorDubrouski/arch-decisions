import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import knex, {type Knex} from 'knex';
import {runSqliteMigrations} from '@/integrations/storage/run-sqlite-migrations';
import {up as createArchitectureDecisionsTable} from '@/migrations/20260315000000_create_architecture_decisions_table';

describe('runSqliteMigrations', () => {
    const originalStorageProvider = process.env.STORAGE_PROVIDER;

    afterEach(() => {
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

describe('create architecture_decisions migration', () => {
    let database: Knex;
    let tempDatabasePath = '';

    beforeEach(() => {
        tempDatabasePath = path.join(os.tmpdir(), `arch-decisions-migrate-${Date.now()}-${Math.random()}.db`);
        database = knex({
            client: 'better-sqlite3',
            connection: {filename: tempDatabasePath},
            useNullAsDefault: true,
        });
    });

    afterEach(async () => {
        await database.destroy();

        if (tempDatabasePath && fs.existsSync(tempDatabasePath)) {
            fs.unlinkSync(tempDatabasePath);
        }
    });

    it('creates architecture_decisions on a fresh database', async () => {
        await createArchitectureDecisionsTable(database);

        expect(await database.schema.hasTable('architecture_decisions')).toBe(true);
        expect(await database.schema.hasTable('adrs')).toBe(false);
    });

    it('is idempotent when architecture_decisions already exists and drops legacy adrs', async () => {
        await database.raw(`
            CREATE TABLE architecture_decisions (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                status TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        `);
        await database.raw(`
            CREATE TABLE adrs (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                status TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        `);

        await expect(createArchitectureDecisionsTable(database)).resolves.toBeUndefined();
        await expect(createArchitectureDecisionsTable(database)).resolves.toBeUndefined();

        expect(await database.schema.hasTable('architecture_decisions')).toBe(true);
        expect(await database.schema.hasTable('adrs')).toBe(false);
    });
});
