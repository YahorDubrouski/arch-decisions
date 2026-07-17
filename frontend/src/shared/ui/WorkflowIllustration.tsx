import {ContextIcon, RecommendationsIcon, DocumentIcon, ArrowRightIcon} from '@/shared/ui/icons/Icons';
import styles from './WorkflowIllustration.module.css';

const STEPS = [
    {label: 'Define context', detail: 'Team, traffic, compliance', Icon: ContextIcon, tone: styles.stepContext},
    {label: 'Evaluate options', detail: 'Compute, secrets, CI/CD', Icon: RecommendationsIcon, tone: styles.stepDecisions},
    {label: 'Generate ADR', detail: 'Summary + full document', Icon: DocumentIcon, tone: styles.stepDocument},
] as const;

export function WorkflowIllustration() {
    return (
        <div className={styles.wrapper} aria-hidden="true">
            <div className={styles.glow}/>
            <div className={styles.steps}>
                {STEPS.map((step, index) => (
                    <div key={step.label} className={styles.stepRow}>
                        <div className={`${styles.stepCard} ${step.tone}`}>
                            <span className={styles.iconWrap}>
                                <step.Icon size={22}/>
                            </span>
                            <div>
                                <p className={styles.stepLabel}>{step.label}</p>
                                <p className={styles.stepDetail}>{step.detail}</p>
                            </div>
                        </div>
                        {index < STEPS.length - 1 && (
                            <span className={styles.arrow}>
                                <ArrowRightIcon size={18}/>
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
