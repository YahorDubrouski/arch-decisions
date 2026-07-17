import {Link} from 'react-router-dom';
import {RecommendationCard} from '@/features/recommendations/components/RecommendationCard';
import {getRecommendations} from '@/features/recommendations/services/recommendationsStorage';
import {getProjectContext} from '@/features/context/services/contextStorage';
import {useGenerateArchitectureDecisionMutation} from '@/features/architecture-decisions/hooks/useGenerateArchitectureDecisionMutation';
import {PageVisualAccent} from '@/shared/brand/PageVisualAccent';
import {EmptyState} from '@/shared/ui/EmptyState';
import {ErrorState} from '@/shared/ui/ErrorState';
import {RecommendationsIcon, EmptyRecommendationsIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './RecommendationsPage.module.css';

export function RecommendationsPage() {
    const recommendations = getRecommendations();
    const context = getProjectContext();
    const {submit, cancel, isSubmitting, submitError, resetSubmitError} =
        useGenerateArchitectureDecisionMutation();

    function handleGenerateArchitectureDecision(): void {
        if (!recommendations || !context) {
            return;
        }

        resetSubmitError();
        submit({context, recommendations});
    }

    const canGenerateArchitectureDecision = Boolean(recommendations && context);

    return (
        <div className={`${ui.pagePanelWide} ${styles.page}`}>
            <header className={styles.header}>
                <div className={styles.headerCopy}>
                    <span className={ui.pageIconWrap}>
                        <RecommendationsIcon size={22}/>
                    </span>
                    <div>
                        <h1 className={ui.pageTitle}>Recommendations</h1>
                        <p className={ui.pageLead}>
                            Options across compute, secrets, and CI/CD with explicit trade-offs.
                        </p>
                    </div>
                </div>
                <PageVisualAccent variant="recommendations"/>
            </header>

            {recommendations ? (
                <div className={styles.cards}>
                    <RecommendationCard recommendation={recommendations.compute}/>
                    <RecommendationCard recommendation={recommendations.secrets}/>
                    <RecommendationCard recommendation={recommendations.cicd}/>
                </div>
            ) : (
                <EmptyState
                    icon={<EmptyRecommendationsIcon/>}
                    message="No recommendations yet. Complete the context workflow to evaluate options."
                    action={
                        <Link to="/context" className={ui.btnPrimary}>
                            Start context workflow
                        </Link>
                    }
                />
            )}

            {recommendations && !context && (
                <p className={ui.helperText}>
                    Project context is missing from this session. Edit context and submit again before generating a
                    document.
                </p>
            )}

            {submitError && (
                <div className={ui.errorBlock}>
                    <ErrorState message={submitError} onRetry={handleGenerateArchitectureDecision}/>
                </div>
            )}

            <div className={ui.actionsRow}>
                {recommendations && (
                    <button
                        type="button"
                        className={ui.btnPrimary}
                        disabled={!canGenerateArchitectureDecision || isSubmitting}
                        onClick={handleGenerateArchitectureDecision}
                    >
                        {isSubmitting ? 'Generating document…' : 'Generate architecture decision'}
                    </button>
                )}
                {isSubmitting && (
                    <button type="button" className={ui.btnGhost} onClick={cancel}>
                        Cancel
                    </button>
                )}
                {recommendations ? (
                    <Link to="/context" className={ui.btnSecondary}>
                        Edit context
                    </Link>
                ) : (
                    <Link to="/context" className={ui.btnSecondary}>
                        Go to context
                    </Link>
                )}
                <Link to="/architecture-decisions" className={ui.btnGhost}>
                    Saved documents
                </Link>
                <Link to="/" className={ui.btnGhost}>
                    Home
                </Link>
            </div>
        </div>
    );
}
