import {Link} from 'react-router-dom';
import {getDecisions} from '@/features/decisions/services/decisionsStorage';
import styles from './DecisionsPage.module.css';

export function DecisionsPage() {
    const decisions = getDecisions();

    return (
        <div className={styles.page}>
            <h1>Architecture Decisions</h1>

            {decisions ? (
                <ul className={styles.summaryList}>
                    <li>
                        <span className={styles.categoryLabel}>Compute:</span> {decisions.compute.recommended}
                    </li>
                    <li>
                        <span className={styles.categoryLabel}>Secrets:</span> {decisions.secrets.recommended}
                    </li>
                    <li>
                        <span className={styles.categoryLabel}>CI/CD:</span> {decisions.cicd.recommended}
                    </li>
                </ul>
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
