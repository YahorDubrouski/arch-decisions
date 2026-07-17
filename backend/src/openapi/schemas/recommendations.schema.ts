import {z} from '../zod.js';
import {ProjectContextSchema} from './project-context.schema.js';

const TradeOffLevelSchema = z.enum(['low', 'medium', 'high']);

export const TradeOffsSchema = z
    .object({
        cost: TradeOffLevelSchema.openapi({description: 'Relative cost of the recommended option.'}),
        complexity: TradeOffLevelSchema.openapi({description: 'Implementation complexity.'}),
        risk: TradeOffLevelSchema.openapi({description: 'Operational / delivery risk.'}),
        operationalOverhead: TradeOffLevelSchema.openapi({
            description: 'Ongoing ops burden after go-live.',
        }),
    })
    .openapi('TradeOffs');

export const RecommendationResultSchema = z
    .object({
        category: z.enum(['compute', 'secrets', 'cicd']),
        recommended: z.string().openapi({example: 'EC2'}),
        alternatives: z.array(z.string()).min(1).openapi({example: ['ECS', 'Lambda']}),
        tradeOffs: TradeOffsSchema,
    })
    .openapi('RecommendationResult');

export const RecommendationsResponseSchema = z
    .object({
        compute: RecommendationResultSchema,
        secrets: RecommendationResultSchema,
        cicd: RecommendationResultSchema,
    })
    .openapi('RecommendationsResponse');

export const EvaluateRecommendationsRequestSchema = z
    .object({
        context: ProjectContextSchema,
    })
    .openapi('EvaluateRecommendationsRequest');
