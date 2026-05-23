import {Link} from 'react-router-dom';
import styles from './HomePage.module.css';

export function HomePage() {
    return (
        <div className={styles.page}>
            <h1>Architecture Decisions Platform</h1>
            <p>Help engineers and architects make informed infrastructure decisions</p>
            <div className={styles.actions}>
                <Link to="/context" className={styles.ctaLink}>
                    Start New Project
                </Link>
            </div>
        </div>
    );
}
