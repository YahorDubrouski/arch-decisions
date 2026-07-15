import type {
    ArchitectureDecision,
    ArchitectureDecisionListItem,
} from '@/domain/architecture-decision.js';
import {getDatabase} from './database.js';
import type {ArchitectureDecisionRepository} from './architecture-decision-repository.js';

type ArchitectureDecisionRow = {
    id: string;
    title: string;
    status: string;
    content: string;
    summary: string;
    created_at: string;
};

type ArchitectureDecisionListRow = {
    id: string;
    title: string;
    status: string;
    summary: string;
    created_at: string;
};

function mapRow(row: ArchitectureDecisionRow): ArchitectureDecision {
    return {
        id: row.id,
        title: row.title,
        status: row.status as ArchitectureDecision['status'],
        content: row.content,
        summary: row.summary,
        createdAt: row.created_at,
    };
}

function mapListRow(row: ArchitectureDecisionListRow): ArchitectureDecisionListItem {
    return {
        id: row.id,
        title: row.title,
        status: row.status as ArchitectureDecisionListItem['status'],
        summary: row.summary,
        createdAt: row.created_at,
    };
}

export class SqliteArchitectureDecisionRepository implements ArchitectureDecisionRepository {
    save(architectureDecision: ArchitectureDecision): void {
        const database = getDatabase();
        database
            .prepare(
                `INSERT INTO architecture_decisions (id, title, status, content, summary, created_at)
         VALUES (@id, @title, @status, @content, @summary, @createdAt)`
            )
            .run({
                id: architectureDecision.id,
                title: architectureDecision.title,
                status: architectureDecision.status,
                content: architectureDecision.content,
                summary: architectureDecision.summary,
                createdAt: architectureDecision.createdAt,
            });
    }

    findById(id: string): ArchitectureDecision | null {
        const database = getDatabase();
        const row = database
            .prepare('SELECT * FROM architecture_decisions WHERE id = ?')
            .get(id) as ArchitectureDecisionRow | undefined;

        if (!row) {
            return null;
        }

        return mapRow(row);
    }

    list(): ArchitectureDecisionListItem[] {
        const database = getDatabase();
        const rows = database
            .prepare(
                `SELECT id, title, status, summary, created_at
         FROM architecture_decisions
         ORDER BY created_at DESC`
            )
            .all() as ArchitectureDecisionListRow[];

        return rows.map(mapListRow);
    }
}
