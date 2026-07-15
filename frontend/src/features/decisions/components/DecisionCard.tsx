import {DecisionResult} from '@/domain/decisions';
import {getDecisionCategoryLabel} from '@/features/decisions/domain/decisionLabels';
import {CicdIcon, ComputeIcon, SecretsIcon} from '@/shared/ui/icons/Icons';
import {TradeOffsGrid} from './TradeOffsGrid';
import styles from './DecisionCard.module.css';

interface DecisionCardProps {
    decision: DecisionResult;
}

const CATEGORY_CLASS: Record<DecisionResult['category'], string> = {
    compute: styles.cardCompute,
    secrets: styles.cardSecrets,
    cicd: styles.cardCicd,
};

const CATEGORY_ICON: Record<DecisionResult['category'], typeof ComputeIcon> = {
    compute: ComputeIcon,
    secrets: SecretsIcon,
    cicd: CicdIcon,
};

export function DecisionCard({decision}: DecisionCardProps) {
    const CategoryIcon = CATEGORY_ICON[decision.category];

    return (
        <article className={`${styles.card} ${CATEGORY_CLASS[decision.category]}`}>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <span className={styles.iconWrap}>
                        <CategoryIcon size={20}/>
                    </span>
                    <span className={styles.categoryBadge}>{decision.category}</span>
                </div>
                <h2 className={styles.title}>{getDecisionCategoryLabel(decision.category)}</h2>
            </header>

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
