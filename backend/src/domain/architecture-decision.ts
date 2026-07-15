export const architectureDecisionStatus = 'proposed' as const;

export interface ArchitectureDecision {
    id: string;
    title: string;
    status: typeof architectureDecisionStatus;
    content: string;
    summary: string;
    createdAt: string;
}

export type ArchitectureDecisionListItem = Pick<
    ArchitectureDecision,
    'id' | 'title' | 'status' | 'summary' | 'createdAt'
>;

export interface ArchitectureDecisionDraft {
    title: string;
    status: typeof architectureDecisionStatus;
    content: string;
    summary: string;
}
