import styles from './ArchitectureDecisionSummary.module.css';

type ArchitectureDecisionSummaryProps = {
    summary: string;
};

export function ArchitectureDecisionSummary({summary}: ArchitectureDecisionSummaryProps) {
    return (
        <section className={styles.summary} aria-label="Architecture decision summary">
            {summary.split('\n').map((line, index) => (
                <p key={`${index}-${line}`}>{line}</p>
            ))}
        </section>
    );
}
