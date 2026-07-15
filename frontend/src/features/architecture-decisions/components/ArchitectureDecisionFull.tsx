import styles from './ArchitectureDecisionFull.module.css';

type ArchitectureDecisionFullProps = {
    content: string;
};

export function ArchitectureDecisionFull({content}: ArchitectureDecisionFullProps) {
    return (
        <pre className={styles.content} aria-label="Architecture decision full document">
            {content}
        </pre>
    );
}
