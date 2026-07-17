/**
 * Turns a plain ADR summary into markdown so it can share the full-document renderer.
 */
export function formatArchitectureDecisionSummaryMarkdown(summary: string): string {
    const trimmed = summary.trim();
    // Find phrases like "ECS (compute)" in the summary so we can list recommendations.
    // Example: "We choose ECS (compute)." → match option "ECS" + category "compute".
    const recommendationMatches = [
        ...trimmed.matchAll(/([^,:]+?)\s*\((compute|secrets|CI\/CD)\)/gi),
    ];

    const lines = ['## Summary', '', trimmed];

    if (recommendationMatches.length > 0) {
        lines.push('', '### Recommendations at a glance', '');

        for (const match of recommendationMatches) {
            // Drop a leading "and " when the phrase was part of a list.
            // Example: "and GitHub Actions" → "GitHub Actions".
            const rawOption = (match[1] ?? '').trim().replace(/^and\s+/i, '');
            const category = normalizeCategory(match[2] ?? '');
            if (!rawOption || !category) {
                continue;
            }

            lines.push(`- **${category}:** ${rawOption}`);
        }
    }

    return `${lines.join('\n')}\n`;
}

function normalizeCategory(value: string): string {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'compute') {
        return 'Compute';
    }
    if (normalized === 'secrets') {
        return 'Secrets';
    }
    if (normalized === 'ci/cd') {
        return 'CI/CD';
    }

    return value.trim();
}
