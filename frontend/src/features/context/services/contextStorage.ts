import {ProjectContext, projectContextSchema} from '@/domain/context';

const PROJECT_CONTEXT_STORAGE_KEY = 'arch-decisions:context';

export function saveProjectContext(context: ProjectContext): void {
    sessionStorage.setItem(PROJECT_CONTEXT_STORAGE_KEY, JSON.stringify(context));
}

export function getProjectContext(): ProjectContext | null {
    const rawValue = sessionStorage.getItem(PROJECT_CONTEXT_STORAGE_KEY);
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = projectContextSchema.safeParse(JSON.parse(rawValue));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

export function clearProjectContext(): void {
    sessionStorage.removeItem(PROJECT_CONTEXT_STORAGE_KEY);
}
