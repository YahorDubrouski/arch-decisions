import Database from 'better-sqlite3';
import {getDatabasePath} from '@/config/database.config.js';

let database: Database.Database | null = null;

export function getDatabase(): Database.Database {
    if (!database) {
        database = new Database(getDatabasePath());
        // Shared SQLite file is opened by API + worker; wait briefly instead of hanging forever.
        // Example: other process holds the lock → wait up to 5s, then fail; WAL lets readers/writers overlap.
        database.pragma('journal_mode = WAL');
        database.pragma('busy_timeout = 5000');
    }

    return database;
}

export function closeDatabase(): void {
    if (database) {
        database.close();
        database = null;
    }
}
