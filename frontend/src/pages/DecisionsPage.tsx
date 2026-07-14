import {Link} from 'react-router-dom';
import styles from './DecisionsPage.module.css';

export function DecisionsPage() {
    return (
        <div className={styles.page}>
            <h1>Architecture Decisions</h1>
            <p className={styles.emptyState}>
                No decisions to display yet. Complete the context builder and submit to evaluate
                recommendations.
            </p>
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
