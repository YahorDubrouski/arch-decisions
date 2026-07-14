import styles from './EmptyState.module.css';

type EmptyStateProps = {
    message: string;
};

export function EmptyState({message}: EmptyStateProps) {
    return <p className={styles.container}>{message}</p>;
}
