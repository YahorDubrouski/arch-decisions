import {Link} from 'react-router-dom';
import type {ArchitectureDecisionListItem} from '@/domain/architectureDecision';
import ui from '@/shared/styles/ui.module.css';
import styles from './ArchitectureDecisionGrid.module.css';

type ArchitectureDecisionGridProps = {
    architectureDecisions: ArchitectureDecisionListItem[];
};

function inferTheme(title: string, summary: string): {label: string; tone: string} {
    const haystack = `${title} ${summary}`.toLowerCase();

    if (haystack.includes('lambda') || haystack.includes('serverless')) {
        return {label: 'Compute · Lambda', tone: styles.toneCompute};
    }
    if (haystack.includes('eks') || haystack.includes('kubernetes')) {
        return {label: 'Compute · EKS', tone: styles.toneCompute};
    }
    if (haystack.includes('ecs')) {
        return {label: 'Compute · ECS', tone: styles.toneCompute};
    }
    if (haystack.includes('vault') || haystack.includes('secrets')) {
        return {label: 'Secrets', tone: styles.toneSecrets};
    }
    if (haystack.includes('pipeline') || haystack.includes('gitlab') || haystack.includes('github')) {
        return {label: 'CI/CD', tone: styles.toneCicd};
    }
    if (haystack.includes('ec2')) {
        return {label: 'Compute · EC2', tone: styles.toneCompute};
    }

    return {label: 'Architecture', tone: styles.toneNeutral};
}

export function ArchitectureDecisionGrid({architectureDecisions}: ArchitectureDecisionGridProps) {
    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <caption className={styles.caption}>Saved architecture decision documents</caption>
                <colgroup>
                    <col className={styles.colTheme}/>
                    <col className={styles.colTitle}/>
                    <col className={styles.colStatus}/>
                    <col className={styles.colCreated}/>
                    <col className={styles.colDescription}/>
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">Theme</th>
                        <th scope="col">Title</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {architectureDecisions.map((architectureDecision) => {
                        const theme = inferTheme(architectureDecision.title, architectureDecision.summary);

                        return (
                            <tr key={architectureDecision.id}>
                                <td className={styles.themeCell}>
                                    <span className={`${styles.themeChip} ${theme.tone}`}>{theme.label}</span>
                                </td>
                                <th scope="row" className={styles.titleCell}>
                                    <Link to={`/architecture-decisions/${architectureDecision.id}`}>
                                        {architectureDecision.title}
                                    </Link>
                                </th>
                                <td className={styles.statusCell}>
                                    <span className={ui.statusBadge}>{architectureDecision.status}</span>
                                </td>
                                <td className={styles.dateCell}>
                                    <time dateTime={architectureDecision.createdAt}>
                                        {new Date(architectureDecision.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </td>
                                <td className={styles.descriptionCell}>{architectureDecision.summary}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
