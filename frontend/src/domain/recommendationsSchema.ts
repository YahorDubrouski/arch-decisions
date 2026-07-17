import {z} from 'zod';

export const tradeOffLevelSchema = z.enum(['low', 'medium', 'high']);

export const tradeOffsSchema = z.object({
    cost: tradeOffLevelSchema,
    complexity: tradeOffLevelSchema,
    risk: tradeOffLevelSchema,
    operationalOverhead: tradeOffLevelSchema,
});

export const recommendationResultSchema = z.object({
    category: z.enum(['compute', 'secrets', 'cicd']),
    recommended: z.string(),
    alternatives: z.array(z.string()),
    tradeOffs: tradeOffsSchema,
});

export const recommendationsResponseSchema = z.object({
    compute: recommendationResultSchema.extend({category: z.literal('compute')}),
    secrets: recommendationResultSchema.extend({category: z.literal('secrets')}),
    cicd: recommendationResultSchema.extend({category: z.literal('cicd')}),
});

export const evaluateRecommendationsApiResponseSchema = z.object({
    recommendations: recommendationsResponseSchema,
});

export type TradeOffLevel = z.infer<typeof tradeOffLevelSchema>;
export type TradeOffs = z.infer<typeof tradeOffsSchema>;
export type RecommendationCategory = z.infer<typeof recommendationResultSchema>['category'];
export type RecommendationResult = z.infer<typeof recommendationResultSchema>;
export type RecommendationsResponse = z.infer<typeof recommendationsResponseSchema>;
export type EvaluateRecommendationsApiResponse = z.infer<typeof evaluateRecommendationsApiResponseSchema>;
