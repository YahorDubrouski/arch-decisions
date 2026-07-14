import {DecisionResult} from '@/domain/decisions';
import {getDecisionCategoryLabel} from '@/features/decisions/domain/decisionLabels';
import {TradeOffsGrid} from './TradeOffsGrid';
import styles from './DecisionCard.module.css';

interface DecisionCardProps {
    decision: DecisionResult;
}

export function DecisionCard({decision}: DecisionCardProps) {
    return (
        <article className={styles.card}>
            <h2 className={styles.title}>{getDecisionCategoryLabel(decision.category)}</h2>

            <section className={styles.section}>
                <span className={styles.sectionLabel}>Recommended</span>
                <p className={styles.recommended}>{decision.recommended}</p>
            </section>

            <section className={styles.section}>
                <span className={styles.sectionLabel}>Alternatives</span>
                {decision.alternatives.length > 0 ? (
                    <ul className={styles.alternatives}>
                        {decision.alternatives.map((alternative) => (
                            <li key={alternative}>{alternative}</li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyAlternatives}>No alternatives provided</p>
                )}
            </section>

            <section className={styles.section}>
                <span className={styles.sectionLabel}>Trade-offs</span>
                <TradeOffsGrid tradeOffs={decision.tradeOffs}/>
            </section>
        </article>
    );
}
