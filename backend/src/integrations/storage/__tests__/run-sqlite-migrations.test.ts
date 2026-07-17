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

    /**
     * Given
     * - Storage provider is configured for in-memory use.
     * When
     * - SQLite migrations are run.
     * Then
     * - Migrations are skipped without error.
     */
    it('when storage provider is memory then skip migrations', async () => {
        // Arrange
        process.env.STORAGE_PROVIDER = 'memory';

        // Act & Assert
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

    /**
     * Given
     * - A fresh SQLite database with no tables.
     * When
     * - The architecture_decisions migration runs.
     * Then
     * - The architecture_decisions table exists and legacy adrs does not.
     */
    it('when database is fresh then create architecture_decisions table', async () => {
        // Arrange
        // Database is empty from beforeEach.

        // Act
        await createArchitectureDecisionsTable(database);

        // Assert
        expect(await database.schema.hasTable('architecture_decisions')).toBe(true);
        expect(await database.schema.hasTable('adrs')).toBe(false);
    });

    /**
     * Given
     * - architecture_decisions and legacy adrs tables already exist.
     * When
     * - The migration runs more than once.
     * Then
     * - architecture_decisions remains and legacy adrs is removed.
     */
    it('when tables already exist then stay idempotent and drop legacy adrs', async () => {
        // Arrange
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

        // Act & Assert
        await expect(createArchitectureDecisionsTable(database)).resolves.toBeUndefined();
        await expect(createArchitectureDecisionsTable(database)).resolves.toBeUndefined();

        // Assert
        expect(await database.schema.hasTable('architecture_decisions')).toBe(true);
        expect(await database.schema.hasTable('adrs')).toBe(false);
    });
});
