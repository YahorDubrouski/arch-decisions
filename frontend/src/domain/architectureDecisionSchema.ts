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

export const architectureDecisionListItemSchema = architectureDecisionSchema.omit({
    content: true,
});

export const architectureDecisionListApiResponseSchema = z.object({
    architectureDecisions: z.array(architectureDecisionListItemSchema),
});

export type ArchitectureDecision = z.infer<typeof architectureDecisionSchema>;
export type ArchitectureDecisionListItem = z.infer<typeof architectureDecisionListItemSchema>;

export type GenerateArchitectureDecisionRequest = {
    context: ProjectContext;
    decisions: DecisionsResponse;
};
