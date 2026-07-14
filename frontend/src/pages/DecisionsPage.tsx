import {Link} from 'react-router-dom';
import {DecisionCard} from '@/features/decisions/components/DecisionCard';
import {getDecisions} from '@/features/decisions/services/decisionsStorage';
import styles from './DecisionsPage.module.css';

export function DecisionsPage() {
    const decisions = getDecisions();

    return (
        <div className={styles.page}>
            <h1>Architecture Decisions</h1>

            {decisions ? (
                <div className={styles.cards}>
                    <DecisionCard decision={decisions.compute}/>
                    <DecisionCard decision={decisions.secrets}/>
                    <DecisionCard decision={decisions.cicd}/>
                </div>
            ) : (
                <p className={styles.emptyState}>
                    No decisions to display yet. Complete the context builder and submit to evaluate
                    recommendations.
                </p>
            )}

            <div className={styles.actions}>
                <Link to="/context" className={styles.link}>
                    Edit Context
                </Link>
                <Link to="/" className={`${styles.link} ${styles.linkSecondary}`}>
                    Home
                </Link>
            </div>
        </div>
    );
}
