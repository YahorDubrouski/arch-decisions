import ReactMarkdown from 'react-markdown';
import styles from './ArchitectureDecisionFull.module.css';

type ArchitectureDecisionFullProps = {
    content: string;
};

export function ArchitectureDecisionFull({content}: ArchitectureDecisionFullProps) {
    return (
        <article
            className={styles.document}
            aria-label="Architecture decision full document"
        >
            <ReactMarkdown>{content}</ReactMarkdown>
        </article>
    );
}
