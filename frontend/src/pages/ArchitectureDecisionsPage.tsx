import {Link} from 'react-router-dom';
import {ArchitectureDecisionList} from '@/features/architecture-decisions/components/ArchitectureDecisionList';
import {useArchitectureDecisionsQuery} from '@/features/architecture-decisions/hooks/useArchitectureDecisionsQuery';
import {EmptyState} from '@/shared/ui/EmptyState';
import {ErrorState} from '@/shared/ui/ErrorState';
import {DocumentIcon, EmptyDecisionsIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './ArchitectureDecisionsPage.module.css';

export function ArchitectureDecisionsPage() {
    const {data = [], isLoading, isError, error, refetch} = useArchitectureDecisionsQuery();

    return (
        <div className={`${ui.pagePanelWide} ${styles.page}`}>
            <header className={styles.header}>
                <span className={ui.pageIconWrap}>
                    <DocumentIcon size={22}/>
                </span>
                <div>
                    <h1 className={ui.pageTitle}>Saved architecture decisions</h1>
                    <p className={ui.pageLead}>
                        Documents generated from evaluated recommendations, newest first.
                    </p>
                </div>
            </header>

            {isLoading && <p className={styles.loading}>Loading saved documents…</p>}

            {isError && (
                <ErrorState
                    message={error instanceof Error ? error.message : 'Failed to load architecture decisions'}
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && data.length === 0 && (
                <EmptyState
                    icon={<EmptyDecisionsIcon/>}
                    message="No architecture decisions saved yet. Evaluate a project context and generate a document."
                    action={
                        <Link to="/context" className={ui.btnPrimary}>
                            Start context workflow
                        </Link>
                    }
                />
            )}

            {!isLoading && !isError && data.length > 0 && (
                <ArchitectureDecisionList architectureDecisions={data}/>
            )}

            <div className={ui.actionsRow}>
                <Link to="/decisions" className={ui.btnSecondary}>
                    View decisions
                </Link>
                <Link to="/" className={ui.btnGhost}>
                    Home
                </Link>
            </div>
        </div>
    );
}
