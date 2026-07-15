import {useState} from 'react';
import styles from './ExportActions.module.css';
import type {ArchitectureDecisionViewMode} from '@/features/architecture-decisions/utils/exportArchitectureDecision';
import {
    copyArchitectureDecisionText,
    downloadArchitectureDecisionMarkdown,
    getArchitectureDecisionDisplayText,
} from '@/features/architecture-decisions/utils/exportArchitectureDecision';

type ExportActionsProps = {
    title: string;
    summary: string;
    content: string;
    viewMode: ArchitectureDecisionViewMode;
};

export function ExportActions({title, summary, content, viewMode}: ExportActionsProps) {
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    async function handleCopy(): Promise<void> {
        const text = getArchitectureDecisionDisplayText({summary, content}, viewMode);
        await copyArchitectureDecisionText(text);
        setFeedbackMessage('Copied to clipboard');
    }

    function handleDownload(): void {
        downloadArchitectureDecisionMarkdown(title, content);
        setFeedbackMessage('Download started');
    }

    return (
        <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={() => void handleCopy()}>
                Copy {viewMode === 'summary' ? 'summary' : 'document'}
            </button>
            <button type="button" className={styles.buttonSecondary} onClick={handleDownload}>
                Download markdown
            </button>
            {feedbackMessage && <p className={styles.feedback}>{feedbackMessage}</p>}
        </div>
    );
}
