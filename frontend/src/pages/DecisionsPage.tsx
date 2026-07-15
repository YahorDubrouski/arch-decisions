import {Link} from 'react-router-dom';
import {DecisionCard} from '@/features/decisions/components/DecisionCard';
import {getDecisions} from '@/features/decisions/services/decisionsStorage';
import {getProjectContext} from '@/features/context/services/contextStorage';
import {useGenerateArchitectureDecisionMutation} from '@/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation';
import {EmptyState} from '@/shared/ui/EmptyState';
import {ErrorState} from '@/shared/ui/ErrorState';
import {DecisionsIcon, EmptyDecisionsIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './DecisionsPage.module.css';

export function DecisionsPage() {
    const decisions = getDecisions();
    const context = getProjectContext();
    const {submit, isSubmitting, submitError, resetSubmitError} = useGenerateArchitectureDecisionMutation();

    function handleGenerateArchitectureDecision(): void {
        if (!decisions || !context) {
            return;
        }

        resetSubmitError();
        submit({context, decisions});
    }

    const canGenerateArchitectureDecision = Boolean(decisions && context);

    return (
        <div className={`${ui.pagePanelWide} ${styles.page}`}>
            <header className={styles.header}>
                <span className={ui.pageIconWrap}>
                    <DecisionsIcon size={22}/>
                </span>
                <div>
                    <h1 className={ui.pageTitle}>Architecture decisions</h1>
                    <p className={ui.pageLead}>
                        Recommendations across compute, secrets, and CI/CD with explicit trade-offs.
                    </p>
                </div>
            </header>

            {decisions ? (
                <div className={styles.cards}>
                    <DecisionCard decision={decisions.compute}/>
                    <DecisionCard decision={decisions.secrets}/>
                    <DecisionCard decision={decisions.cicd}/>
                </div>
            ) : (
                <EmptyState
                    icon={<EmptyDecisionsIcon/>}
                    message="No decisions yet. Complete the context workflow to evaluate recommendations."
                />
            )}

            {decisions && !context && (
                <p className={ui.helperText}>
                    Project context is missing from this session. Edit context and submit again before generating a document.
                </p>
            )}

            {submitError && (
                <div className={ui.errorBlock}>
                    <ErrorState message={submitError} onRetry={handleGenerateArchitectureDecision}/>
                </div>
            )}

            <div className={ui.actionsRow}>
                {decisions && (
                    <button
                        type="button"
                        className={ui.btnPrimary}
                        disabled={!canGenerateArchitectureDecision || isSubmitting}
                        onClick={handleGenerateArchitectureDecision}
                    >
                        {isSubmitting ? 'Generating document…' : 'Generate architecture decision'}
                    </button>
                )}
                <Link to="/context" className={ui.btnSecondary}>
                    Edit context
                </Link>
                <Link to="/" className={ui.btnGhost}>
                    Home
                </Link>
            </div>
        </div>
    );
}
