import {ReactNode} from 'react';
import styles from './EmptyState.module.css';

type EmptyStateProps = {
    message: string;
    icon?: ReactNode;
};

export function EmptyState({message, icon}: EmptyStateProps) {
    return (
        <div className={styles.container}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <p>{message}</p>
        </div>
    );
}
