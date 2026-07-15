import {Link} from 'react-router-dom';
import type {ArchitectureDecisionListItem} from '@/domain/architectureDecision';
import ui from '@/shared/styles/ui.module.css';
import styles from './ArchitectureDecisionList.module.css';

type ArchitectureDecisionListProps = {
    architectureDecisions: ArchitectureDecisionListItem[];
};

export function ArchitectureDecisionList({architectureDecisions}: ArchitectureDecisionListProps) {
    return (
        <ul className={styles.list}>
            {architectureDecisions.map((architectureDecision) => (
                <li key={architectureDecision.id} className={styles.item}>
                    <div className={styles.meta}>
                        <span className={ui.statusBadge}>{architectureDecision.status}</span>
                        <time dateTime={architectureDecision.createdAt} className={styles.date}>
                            {new Date(architectureDecision.createdAt).toLocaleString()}
                        </time>
                    </div>
                    <h2 className={styles.title}>
                        <Link to={`/architecture-decisions/${architectureDecision.id}`}>
                            {architectureDecision.title}
                        </Link>
                    </h2>
                    <p className={styles.summary}>{architectureDecision.summary}</p>
                </li>
            ))}
        </ul>
    );
}
