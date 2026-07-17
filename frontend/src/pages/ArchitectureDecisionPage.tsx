import {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ArchitectureDecisionFull} from '@/features/architecture-decisions/components/ArchitectureDecisionFull';
import {ArchitectureDecisionSummary} from '@/features/architecture-decisions/components/ArchitectureDecisionSummary';
import {ExportActions} from '@/features/architecture-decisions/components/ExportActions';
import {ViewToggle} from '@/features/architecture-decisions/components/ViewToggle';
import {useArchitectureDecisionQuery} from '@/features/architecture-decisions/hooks/useArchitectureDecisionQuery';
import type {ArchitectureDecisionViewMode} from '@/features/architecture-decisions/utils/exportArchitectureDecision';
import {ErrorState} from '@/shared/ui/ErrorState';
import {DocumentIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './ArchitectureDecisionPage.module.css';

export function ArchitectureDecisionPage() {
    const {decisionId} = useParams<{decisionId: string}>();
    const [viewMode, setViewMode] = useState<ArchitectureDecisionViewMode>('summary');
    const {data, isLoading, isError, error, refetch} = useArchitectureDecisionQuery(decisionId);

    if (!decisionId) {
        return (
            <div className={ui.pagePanel}>
                <ErrorState message="Architecture decision id is missing from the URL."/>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={`${ui.pagePanel} ${styles.page}`}>
                <p className={styles.loading}>Loading architecture decision…</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className={`${ui.pagePanel} ${styles.page}`}>
                <ErrorState
                    message={error instanceof Error ? error.message : 'Architecture decision not found'}
                    onRetry={() => void refetch()}
                />
                <div className={ui.actionsRow}>
                    <Link to="/recommendations" className={ui.btnSecondary}>
                        Back to recommendations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`${ui.pagePanel} ${styles.page}`}>
            <header className={styles.header}>
                <span className={ui.pageIconWrap}>
                    <DocumentIcon size={22}/>
                </span>
                <div>
                    <span className={ui.statusBadge}>{data.status}</span>
                    <h1 className={styles.title}>{data.title}</h1>
                    <p className={styles.meta}>Created {new Date(data.createdAt).toLocaleString()}</p>
                </div>
            </header>

            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode}/>

            {viewMode === 'summary' ? (
                <ArchitectureDecisionSummary summary={data.summary}/>
            ) : (
                <ArchitectureDecisionFull content={data.content}/>
            )}

            <ExportActions
                title={data.title}
                summary={data.summary}
                content={data.content}
                viewMode={viewMode}
            />

            <div className={ui.actionsRow}>
                <Link to="/recommendations" className={ui.btnSecondary}>
                    Back to recommendations
                </Link>
                <Link to="/" className={ui.btnGhost}>
                    Home
                </Link>
            </div>
        </div>
    );
}
