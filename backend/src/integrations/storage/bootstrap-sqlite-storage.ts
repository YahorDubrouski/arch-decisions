import {runSqliteMigrations} from './run-sqlite-migrations.js';

export async function bootstrapSqliteStorage(): Promise<void> {
    await runSqliteMigrations();
}
