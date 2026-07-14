import {DecisionsResponse} from '@/domain/decisions';

const DECISIONS_STORAGE_KEY = 'arch-decisions:decisions';

export function saveDecisions(decisions: DecisionsResponse): void {
    sessionStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
}

export function getDecisions(): DecisionsResponse | null {
    const rawValue = sessionStorage.getItem(DECISIONS_STORAGE_KEY);
    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue) as DecisionsResponse;
    } catch {
        return null;
    }
}

export function clearDecisions(): void {
    sessionStorage.removeItem(DECISIONS_STORAGE_KEY);
}
