import {
    ArchitectureDecision,
    ArchitectureDecisionListItem,
    architectureDecisionSchema,
} from '@/domain/architectureDecision';

export const ARCHITECTURE_DECISION_STORAGE_PREFIX = 'arch-decisions:architecture-decision:';

function storageKey(decisionId: string): string {
    return `${ARCHITECTURE_DECISION_STORAGE_PREFIX}${decisionId}`;
}

function toListItem(architectureDecision: ArchitectureDecision): ArchitectureDecisionListItem {
    return {
        id: architectureDecision.id,
        title: architectureDecision.title,
        status: architectureDecision.status,
        summary: architectureDecision.summary,
        createdAt: architectureDecision.createdAt,
    };
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

export function listStoredArchitectureDecisions(): ArchitectureDecision[] {
    const decisions: ArchitectureDecision[] = [];

    for (let index = 0; index < sessionStorage.length; index += 1) {
        const key = sessionStorage.key(index);
        if (!key?.startsWith(ARCHITECTURE_DECISION_STORAGE_PREFIX)) {
            continue;
        }

        const decisionId = key.slice(ARCHITECTURE_DECISION_STORAGE_PREFIX.length);
        const decision = getArchitectureDecisionById(decisionId);
        if (decision) {
            decisions.push(decision);
        }
    }

    return decisions.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function listArchitectureDecisionItems(): ArchitectureDecisionListItem[] {
    return listStoredArchitectureDecisions().map(toListItem);
}

export function clearArchitectureDecision(decisionId: string): void {
    sessionStorage.removeItem(storageKey(decisionId));
}
