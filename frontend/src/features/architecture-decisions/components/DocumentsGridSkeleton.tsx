import styles from './DocumentsGridSkeleton.module.css';

export function DocumentsGridSkeleton() {
    return (
        <div className={styles.wrapper} role="status" aria-live="polite" aria-label="Loading documents">
            {Array.from({length: 5}, (_, index) => (
                <div key={index} className={styles.row}>
                    <span className={`${styles.block} ${styles.badge}`}/>
                    <span className={`${styles.block} ${styles.title}`}/>
                    <span className={`${styles.block} ${styles.badge}`}/>
                    <span className={`${styles.block} ${styles.date}`}/>
                    <span className={`${styles.block} ${styles.summary}`}/>
                </div>
            ))}
        </div>
    );
}
