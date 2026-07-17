export const architectureDecisionStatus = 'proposed' as const;

export interface ArchitectureDecision {
    id: string;
    title: string;
    status: typeof architectureDecisionStatus;
    content: string;
    summary: string;
    createdAt: string;
}

export type ArchitectureDecisionListItem = Pick<
    ArchitectureDecision,
    'id' | 'title' | 'status' | 'summary' | 'createdAt'
>;

export type ArchitectureDecisionListFilters = {
    search?: string;
    status?: string;
};

export function matchesArchitectureDecisionListFilters(
    item: ArchitectureDecisionListItem,
    filters: ArchitectureDecisionListFilters
): boolean {
    const normalizedSearch = filters.search?.trim().toLowerCase();
    if (filters.status && item.status !== filters.status) {
        return false;
    }

    if (normalizedSearch) {
        const haystack = `${item.title} ${item.summary}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
            return false;
        }
    }

    return true;
}

export interface ArchitectureDecisionDraft {
    title: string;
    status: typeof architectureDecisionStatus;
    content: string;
    summary: string;
}
