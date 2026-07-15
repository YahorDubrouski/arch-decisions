import {useId, useState} from 'react';
import {DecisionResult} from '@/domain/decisions';
import {getDecisionCategoryLabel} from '@/features/decisions/domain/decisionLabels';
import {ChevronIcon, CicdIcon, ComputeIcon, SecretsIcon} from '@/shared/ui/icons/Icons';
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
    const [isExpanded, setIsExpanded] = useState(true);
    const detailsId = useId();
    const CategoryIcon = CATEGORY_ICON[decision.category];
    const categoryLabel = getDecisionCategoryLabel(decision.category);
    const toggleLabel = isExpanded ? `Hide ${categoryLabel} details` : `Show ${categoryLabel} details`;

    return (
        <article className={`${styles.card} ${CATEGORY_CLASS[decision.category]}`}>
            <header className={styles.header}>
                <div className={styles.headerRow}>
                    <div>
                        <div className={styles.headerTop}>
                            <span className={styles.iconWrap}>
                                <CategoryIcon size={20}/>
                            </span>
                            <span className={styles.categoryBadge}>{decision.category}</span>
                        </div>
                        <h2 className={styles.title}>{categoryLabel}</h2>
                    </div>
                    <button
                        type="button"
                        className={styles.toggle}
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => setIsExpanded((previous) => !previous)}
                    >
                        <span>{isExpanded ? 'Hide details' : 'Show details'}</span>
                        <ChevronIcon
                            size={16}
                            className={isExpanded ? styles.chevronExpanded : styles.chevron}
                        />
                        <span className={styles.visuallyHidden}>{toggleLabel}</span>
                    </button>
                </div>
            </header>

            <section className={styles.section}>
                <span className={styles.sectionLabel}>Recommended</span>
                <p className={styles.recommended}>{decision.recommended}</p>
            </section>

            <div id={detailsId} hidden={!isExpanded}>
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
            </div>
        </article>
    );
}
