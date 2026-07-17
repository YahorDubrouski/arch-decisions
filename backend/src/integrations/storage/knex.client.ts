import path from 'node:path';
import knex, {type Knex} from 'knex';
import {getDatabasePath} from '@/config/database.config.js';

let knexInstance: Knex | null = null;

function getMigrationsDirectory(): string {
    return path.join(process.cwd(), 'src', 'migrations');
}

export function createKnexConfig(): Knex.Config {
    return {
        client: 'better-sqlite3',
        connection: {
            filename: getDatabasePath(),
        },
        useNullAsDefault: true,
        pool: {
            afterCreate(connection: {pragma: (sql: string) => unknown}, done: (error: Error | null, connection: unknown) => void): void {
                // Shared SQLite file is opened by API + worker; wait briefly instead of hanging forever.
                // Example: other process holds the lock → wait up to 5s, then fail; WAL lets readers/writers overlap.
                connection.pragma('journal_mode = WAL');
                connection.pragma('busy_timeout = 5000');
                done(null, connection);
            },
        },
        migrations: {
            directory: getMigrationsDirectory(),
            extension: 'ts',
            loadExtensions: ['.ts'],
        },
    };
}

export function getKnex(): Knex {
    if (!knexInstance) {
        knexInstance = knex(createKnexConfig());
    }

    return knexInstance;
}

export async function destroyKnex(): Promise<void> {
    if (knexInstance) {
        await knexInstance.destroy();
        knexInstance = null;
    }
}
