import {z} from 'zod';
import type {ProjectContext} from './contextSchema';
import type {DecisionsResponse} from './decisionsSchema';

export const architectureDecisionStatusSchema = z.literal('proposed');

export const architectureDecisionSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: architectureDecisionStatusSchema,
    content: z.string(),
    summary: z.string(),
    createdAt: z.string(),
});

export const architectureDecisionApiResponseSchema = z.object({
    architectureDecision: architectureDecisionSchema,
});

export type ArchitectureDecision = z.infer<typeof architectureDecisionSchema>;

export type GenerateArchitectureDecisionRequest = {
    context: ProjectContext;
    decisions: DecisionsResponse;
};
