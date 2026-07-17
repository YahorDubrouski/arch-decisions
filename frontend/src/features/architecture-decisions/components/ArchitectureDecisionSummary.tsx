import ReactMarkdown from 'react-markdown';
import {formatArchitectureDecisionSummaryMarkdown} from '@/features/architecture-decisions/domain/formatArchitectureDecisionSummaryMarkdown';
import documentStyles from './ArchitectureDecisionFull.module.css';

type ArchitectureDecisionSummaryProps = {
    summary: string;
};

export function ArchitectureDecisionSummary({summary}: ArchitectureDecisionSummaryProps) {
    return (
        <article className={documentStyles.document} aria-label="Architecture decision summary">
            <ReactMarkdown>{formatArchitectureDecisionSummaryMarkdown(summary)}</ReactMarkdown>
        </article>
    );
}
