import {ReactNode} from 'react';
import styles from './EmptyState.module.css';

type EmptyStateProps = {
    message: string;
    icon?: ReactNode;
    action?: ReactNode;
};

export function EmptyState({message, icon, action}: EmptyStateProps) {
    return (
        <div className={styles.container}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <p>{message}</p>
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
