import styles from './PageFallback.module.css';

export function PageFallback() {
    return (
        <div className={styles.fallback} role="status" aria-live="polite">
            <p className={styles.message}>Loading page…</p>
            <p className={styles.hint}>Fetching the route’s JavaScript bundle (not API data).</p>
        </div>
    );
}
