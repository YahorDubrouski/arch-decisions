import type {ArchitectureDecisionListItem} from '@/domain/architectureDecision';

export type ArchitectureDecisionListQuery = {
    search?: string;
    status?: string;
};

export function matchesArchitectureDecisionListFilters(
    item: ArchitectureDecisionListItem,
    filters: ArchitectureDecisionListQuery
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
