import {Link} from 'react-router-dom';
import {ArchitectureDecisionFilters} from '@/features/architecture-decisions/components/ArchitectureDecisionFilters';
import {ArchitectureDecisionGrid} from '@/features/architecture-decisions/components/ArchitectureDecisionGrid';
import {ArchitectureDecisionPagination} from '@/features/architecture-decisions/components/ArchitectureDecisionPagination';
import {DocumentsGridSkeleton} from '@/features/architecture-decisions/components/DocumentsGridSkeleton';
import {
    areArchitectureDecisionListFiltersEmpty,
    paginateItems,
} from '@/features/architecture-decisions/domain/listFilters';
import {useArchitectureDecisionListFilters} from '@/features/architecture-decisions/hooks/useArchitectureDecisionListFilters';
import {useArchitectureDecisionsQuery} from '@/features/architecture-decisions/hooks/useArchitectureDecisionsQuery';
import {PageVisualAccent} from '@/shared/brand/PageVisualAccent';
import {EmptyState} from '@/shared/ui/EmptyState';
import {ErrorState} from '@/shared/ui/ErrorState';
import {DocumentIcon, EmptyRecommendationsIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './ArchitectureDecisionsPage.module.css';

export function ArchitectureDecisionsPage() {
    const {
        draftFilters,
        appliedFilters,
        updateDraftFilters,
        applyFilters,
        clearFilters,
        setPage,
        setPageSize,
    } = useArchitectureDecisionListFilters();
    const {data = [], isLoading, isError, error, refetch} = useArchitectureDecisionsQuery(appliedFilters);
    const hasAppliedFilters = !areArchitectureDecisionListFiltersEmpty(appliedFilters);
    const pagination = paginateItems(data, appliedFilters.page, appliedFilters.pageSize);

    return (
        <div className={styles.page} data-page="architecture-decisions">
            <header className={styles.header}>
                <div className={styles.headerCopy}>
                    <span className={ui.pageIconWrap}>
                        <DocumentIcon size={22}/>
                    </span>
                    <div>
                        <h1 className={ui.pageTitle}>Saved architecture decisions</h1>
                        <p className={ui.pageLead}>
                            Filterable archive of generated documents. Filters and page live in the URL
                            and drive the query key.
                        </p>
                    </div>
                </div>
                <PageVisualAccent variant="documents"/>
            </header>

            <ArchitectureDecisionFilters
                draftFilters={draftFilters}
                onDraftChange={updateDraftFilters}
                onApply={applyFilters}
                onClear={clearFilters}
            />

            {isLoading && <DocumentsGridSkeleton/>}

            {isError && (
                <ErrorState
                    message={error instanceof Error ? error.message : 'Failed to load architecture decisions'}
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && data.length === 0 && (
                <EmptyState
                    icon={<EmptyRecommendationsIcon/>}
                    message={
                        hasAppliedFilters
                            ? 'No documents match these filters. Clear filters or try a different search.'
                            : 'No architecture decisions saved yet. Evaluate a project context and generate a document.'
                    }
                    action={
                        hasAppliedFilters ? (
                            <button type="button" className={ui.btnSecondary} onClick={clearFilters}>
                                Clear filters
                            </button>
                        ) : (
                            <Link to="/context" className={ui.btnPrimary}>
                                Start context workflow
                            </Link>
                        )
                    }
                />
            )}

            {!isLoading && !isError && data.length > 0 && (
                <>
                    <ArchitectureDecisionGrid architectureDecisions={pagination.pageItems}/>
                    <ArchitectureDecisionPagination
                        page={pagination.page}
                        pageSize={appliedFilters.pageSize}
                        total={pagination.total}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                    />
                </>
            )}

            <div className={ui.actionsRow}>
                <Link to="/recommendations" className={ui.btnSecondary}>
                    View recommendations
                </Link>
                <Link to="/" className={ui.btnGhost}>
                    Home
                </Link>
            </div>
        </div>
    );
}
