import ui from '@/shared/styles/ui.module.css';
import styles from './ArchitectureDecisionPagination.module.css';

type ArchitectureDecisionPaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
};

const PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

export function ArchitectureDecisionPagination({
    page,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange,
}: ArchitectureDecisionPaginationProps) {
    const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const rangeEnd = Math.min(page * pageSize, total);

    return (
        <nav className={styles.nav} aria-label="Documents pagination">
            <p className={styles.summary} aria-live="polite">
                Showing {rangeStart}–{rangeEnd} of {total}
            </p>

            <div className={styles.controls}>
                <label className={styles.pageSize} htmlFor="documents-page-size">
                    <span className={styles.pageSizeLabel}>Per page</span>
                    <select
                        id="documents-page-size"
                        className={styles.select}
                        value={pageSize}
                        onChange={(event) => onPageSizeChange(Number(event.currentTarget.value))}
                    >
                        {PAGE_SIZE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={ui.btnGhost}
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        Previous
                    </button>
                    <span className={styles.pageIndicator}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        type="button"
                        className={ui.btnGhost}
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </nav>
    );
}
