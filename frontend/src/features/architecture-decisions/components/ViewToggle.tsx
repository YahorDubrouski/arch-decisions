import styles from './ViewToggle.module.css';
import type {ArchitectureDecisionViewMode} from '@/features/architecture-decisions/utils/exportArchitectureDecision';

type ViewToggleProps = {
    viewMode: ArchitectureDecisionViewMode;
    onViewModeChange: (viewMode: ArchitectureDecisionViewMode) => void;
};

export function ViewToggle({viewMode, onViewModeChange}: ViewToggleProps) {
    return (
        <div className={styles.toggle} role="group" aria-label="Architecture decision view mode">
            <button
                type="button"
                className={viewMode === 'summary' ? styles.active : styles.inactive}
                aria-pressed={viewMode === 'summary'}
                onClick={() => onViewModeChange('summary')}
            >
                Summary
            </button>
            <button
                type="button"
                className={viewMode === 'full' ? styles.active : styles.inactive}
                aria-pressed={viewMode === 'full'}
                onClick={() => onViewModeChange('full')}
            >
                Full document
            </button>
        </div>
    );
}
