export const ARCHITECTURE_JOBS_QUEUE_NAME = 'architecture-jobs';

export const architectureJobTypes = {
    evaluateRecommendations: 'evaluate-recommendations',
    generateArchitectureDecision: 'generate-architecture-decision',
} as const;

export type ArchitectureJobType =
    (typeof architectureJobTypes)[keyof typeof architectureJobTypes];
