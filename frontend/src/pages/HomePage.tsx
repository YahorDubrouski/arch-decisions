import {Link, useNavigate} from 'react-router-dom';
import {ArchitectureFlowDiagram} from '@/shared/brand/ArchitectureFlowDiagram';
import {clearProjectSession, hasProjectSession} from '@/shared/session/projectSession';
import {CheckCircleIcon} from '@/shared/ui/icons/Icons';
import ui from '@/shared/styles/ui.module.css';
import styles from './HomePage.module.css';

const FEATURES = [
    'Capture project constraints in a guided workflow',
    'Evaluate compute, secrets, and CI/CD trade-offs',
    'Generate architecture decision documents',
] as const;

export function HomePage() {
    const navigate = useNavigate();

    function handleStartNewProject(): void {
        if (hasProjectSession()) {
            const confirmed = window.confirm(
                'Start a new project? This clears your current context, recommendations, and documents from this session.'
            );
            if (!confirmed) {
                return;
            }
        }

        clearProjectSession();
        navigate('/context');
    }

    return (
        <div className={styles.hero}>
            <div className={styles.heroContent}>
                <p className={styles.brandLockup}>Arch Decisions</p>
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
                    <button type="button" className={ui.btnPrimary} onClick={handleStartNewProject}>
                        Start new project
                    </button>
                    <Link to="/recommendations" className={ui.btnSecondary}>
                        View recommendations
                    </Link>
                </div>
            </div>

            <aside className={styles.heroAside} aria-label="Architecture decision flow diagram">
                <ArchitectureFlowDiagram/>
            </aside>
        </div>
    );
}
