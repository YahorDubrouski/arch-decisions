export type ArchitectureDecisionViewMode = 'summary' | 'full';

export async function copyArchitectureDecisionText(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
}

function toDownloadFileName(title: string): string {
    // Turn the title into a safe download name: keep letters/digits, replace the rest with "-".
    // Example: "My ADR!" → "my-adr.md"; "---" → "architecture-decision.md".
    const normalizedTitle = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${normalizedTitle || 'architecture-decision'}.md`;
}

export function downloadArchitectureDecisionMarkdown(title: string, content: string): void {
    const blob = new Blob([content], {type: 'text/markdown;charset=utf-8'});
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = objectUrl;
    anchor.download = toDownloadFileName(title);
    anchor.click();

    URL.revokeObjectURL(objectUrl);
}

export function getArchitectureDecisionDisplayText(
    architectureDecision: {summary: string; content: string},
    viewMode: ArchitectureDecisionViewMode
): string {
    return viewMode === 'summary' ? architectureDecision.summary : architectureDecision.content;
}
