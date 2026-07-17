import {z} from '../zod.js';
import {ProjectContextSchema} from './project-context.schema.js';
import {RecommendationsResponseSchema} from './recommendations.schema.js';

export const GenerateArchitectureDecisionRequestSchema = z
    .object({
        context: ProjectContextSchema,
        recommendations: RecommendationsResponseSchema,
    })
    .openapi('GenerateArchitectureDecisionRequest');

export const ArchitectureDecisionListItemSchema = z
    .object({
        id: z.string(),
        title: z.string(),
        status: z.literal('proposed'),
        summary: z.string(),
        createdAt: z.string().openapi({description: 'ISO-8601 creation timestamp.'}),
    })
    .openapi('ArchitectureDecisionListItem');

export const ArchitectureDecisionSchema = ArchitectureDecisionListItemSchema.extend({
    content: z.string().openapi({description: 'Full markdown Architecture Decision Record.'}),
}).openapi('ArchitectureDecision');

export const ArchitectureDecisionListResponseSchema = z
    .object({
        architectureDecisions: z.array(ArchitectureDecisionListItemSchema),
    })
    .openapi('ArchitectureDecisionListResponse');

export const ArchitectureDecisionResponseSchema = z
    .object({
        architectureDecision: ArchitectureDecisionSchema,
    })
    .openapi('ArchitectureDecisionResponse');
