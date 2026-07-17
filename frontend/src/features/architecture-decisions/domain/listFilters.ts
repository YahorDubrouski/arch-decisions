export const DEFAULT_ARCHITECTURE_DECISION_PAGE_SIZE = 5;

export type ArchitectureDecisionListFilters = {
    search: string;
    status: string;
    page: number;
    pageSize: number;
};

export const DEFAULT_ARCHITECTURE_DECISION_LIST_FILTERS: ArchitectureDecisionListFilters = {
    search: '',
    status: '',
    page: 1,
    pageSize: DEFAULT_ARCHITECTURE_DECISION_PAGE_SIZE,
};

export function areArchitectureDecisionListFiltersEmpty(
    filters: Pick<ArchitectureDecisionListFilters, 'search' | 'status'>
): boolean {
    return filters.search.trim() === '' && filters.status === '';
}

export function paginateItems<T>(items: T[], page: number, pageSize: number): {
    pageItems: T[];
    total: number;
    totalPages: number;
    page: number;
} {
    const total = items.length;
    // Always keep at least one page so the UI never shows “page 0”.
    // Example: 0 items, pageSize 5 → 1 page; 12 items, pageSize 5 → 3 pages.
    const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;

    return {
        pageItems: items.slice(start, start + pageSize),
        total,
        totalPages,
        page: safePage,
    };
}
