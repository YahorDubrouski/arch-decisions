import {FormEvent} from 'react';
import type {ArchitectureDecisionListFilters} from '@/features/architecture-decisions/domain/listFilters';
import ui from '@/shared/styles/ui.module.css';
import styles from './ArchitectureDecisionFilters.module.css';

type ArchitectureDecisionFiltersProps = {
    draftFilters: ArchitectureDecisionListFilters;
    onDraftChange: (updates: Partial<ArchitectureDecisionListFilters>) => void;
    onApply: (event: FormEvent<HTMLFormElement>) => void;
    onClear: () => void;
};

export function ArchitectureDecisionFilters({
    draftFilters,
    onDraftChange,
    onApply,
    onClear,
}: ArchitectureDecisionFiltersProps) {
    return (
        <form className={styles.form} onSubmit={onApply} aria-label="Filter saved documents">
            <div className={styles.fields}>
                <label className={styles.field} htmlFor="documents-search">
                    <span className={styles.label}>Search</span>
                    <input
                        id="documents-search"
                        type="search"
                        className={styles.input}
                        value={draftFilters.search}
                        onChange={(event) => onDraftChange({search: event.currentTarget.value})}
                        placeholder="Title or summary"
                    />
                </label>

                <label className={styles.field} htmlFor="documents-status">
                    <span className={styles.label}>Status</span>
                    <select
                        id="documents-status"
                        className={styles.input}
                        value={draftFilters.status}
                        onChange={(event) => onDraftChange({status: event.currentTarget.value})}
                    >
                        <option value="">All statuses</option>
                        <option value="proposed">proposed</option>
                    </select>
                </label>
            </div>

            <div className={styles.actions}>
                <button type="submit" className={ui.btnPrimary}>
                    Apply filters
                </button>
                <button type="button" className={ui.btnGhost} onClick={onClear}>
                    Clear
                </button>
            </div>
        </form>
    );
}
