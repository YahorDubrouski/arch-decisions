import {Link} from 'react-router-dom';
import {WorkflowIllustration} from '@/shared/ui/WorkflowIllustration';
import {CheckCircleIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './HomePage.module.css';

const FEATURES = [
    'Capture project constraints in a guided workflow',
    'Evaluate compute, secrets, and CI/CD trade-offs',
    'Generate architecture decision documents',
] as const;

export function HomePage() {
    return (
        <div className={styles.hero}>
            <div className={styles.heroContent}>
                <span className={ui.eyebrow}>Architecture decision workflow</span>
                <h1 className={styles.title}>
                    Turn context into clear{' '}
                    <span className={styles.titleAccent}>infrastructure decisions</span>
                </h1>
                <p className={styles.subtitle}>
                    A portfolio-grade demo of structured decision-making: from team constraints to
                    recommendations and documented outcomes.
                </p>

                <ul className={styles.featureList}>
                    {FEATURES.map((feature) => (
                        <li key={feature}>
                            <CheckCircleIcon size={18} className={styles.featureIcon}/>
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <Link to="/context" className={ui.btnPrimary}>
                        Start new project
                    </Link>
                    <Link to="/decisions" className={ui.btnSecondary}>
                        View decisions
                    </Link>
                </div>
            </div>

            <aside className={styles.heroAside} aria-label="Workflow overview">
                <WorkflowIllustration/>
            </aside>
        </div>
    );
}
