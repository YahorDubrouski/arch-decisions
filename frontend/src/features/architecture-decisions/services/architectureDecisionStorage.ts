import {
    ArchitectureDecision,
    architectureDecisionSchema,
} from '@/domain/architectureDecision';

function storageKey(decisionId: string): string {
    return `arch-decisions:architecture-decision:${decisionId}`;
}

export function saveArchitectureDecision(architectureDecision: ArchitectureDecision): void {
    sessionStorage.setItem(storageKey(architectureDecision.id), JSON.stringify(architectureDecision));
}

export function getArchitectureDecisionById(decisionId: string): ArchitectureDecision | null {
    const rawValue = sessionStorage.getItem(storageKey(decisionId));
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = architectureDecisionSchema.safeParse(JSON.parse(rawValue));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

export function clearArchitectureDecision(decisionId: string): void {
    sessionStorage.removeItem(storageKey(decisionId));
}
