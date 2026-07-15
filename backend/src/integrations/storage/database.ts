import Database from 'better-sqlite3';
import {getDatabasePath} from '@/config/database.config.js';

let database: Database.Database | null = null;

export function getDatabase(): Database.Database {
    if (!database) {
        database = new Database(getDatabasePath());
    }

    return database;
}

export function closeDatabase(): void {
    if (database) {
        database.close();
        database = null;
    }
}
