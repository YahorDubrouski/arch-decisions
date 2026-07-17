import {FormEvent, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {
    ArchitectureDecisionListFilters,
    DEFAULT_ARCHITECTURE_DECISION_LIST_FILTERS,
    DEFAULT_ARCHITECTURE_DECISION_PAGE_SIZE,
} from '@/features/architecture-decisions/domain/listFilters';

function parsePositiveInt(value: string | null, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readAppliedFilters(searchParams: URLSearchParams): ArchitectureDecisionListFilters {
    return {
        search: searchParams.get('search') ?? '',
        status: searchParams.get('status') ?? '',
        page: parsePositiveInt(searchParams.get('page'), 1),
        pageSize: parsePositiveInt(searchParams.get('pageSize'), DEFAULT_ARCHITECTURE_DECISION_PAGE_SIZE),
    };
}

function toSearchParams(filters: ArchitectureDecisionListFilters): URLSearchParams {
    const nextParams = new URLSearchParams();

    if (filters.search.trim()) {
        nextParams.set('search', filters.search.trim());
    }

    if (filters.status) {
        nextParams.set('status', filters.status);
    }

    if (filters.page > 1) {
        nextParams.set('page', String(filters.page));
    }

    if (filters.pageSize !== DEFAULT_ARCHITECTURE_DECISION_PAGE_SIZE) {
        nextParams.set('pageSize', String(filters.pageSize));
    }

    return nextParams;
}

export function useArchitectureDecisionListFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const appliedFilters = readAppliedFilters(searchParams);
    const [draftFilters, setDraftFilters] = useState<ArchitectureDecisionListFilters>(appliedFilters);

    // URL is an external system (shareable / back-forward); keep draft filters in sync with it.
    useEffect(() => {
        setDraftFilters(readAppliedFilters(searchParams));
    }, [searchParams]);

    function updateDraftFilters(updates: Partial<ArchitectureDecisionListFilters>): void {
        setDraftFilters((previous) => ({...previous, ...updates}));
    }

    function applyFilters(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setSearchParams(
            toSearchParams({
                ...draftFilters,
                page: 1,
            })
        );
    }

    function clearFilters(): void {
        setDraftFilters(DEFAULT_ARCHITECTURE_DECISION_LIST_FILTERS);
        setSearchParams(new URLSearchParams());
    }

    function setPage(page: number): void {
        setSearchParams(
            toSearchParams({
                ...appliedFilters,
                page,
            })
        );
    }

    function setPageSize(pageSize: number): void {
        setSearchParams(
            toSearchParams({
                ...appliedFilters,
                page: 1,
                pageSize,
            })
        );
    }

    return {
        draftFilters,
        appliedFilters,
        updateDraftFilters,
        applyFilters,
        clearFilters,
        setPage,
        setPageSize,
    };
}
