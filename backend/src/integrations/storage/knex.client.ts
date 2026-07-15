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
