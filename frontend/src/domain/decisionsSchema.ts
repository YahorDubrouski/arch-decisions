import {z} from 'zod';

export const tradeOffLevelSchema = z.enum(['low', 'medium', 'high']);

export const tradeOffsSchema = z.object({
    cost: tradeOffLevelSchema,
    complexity: tradeOffLevelSchema,
    risk: tradeOffLevelSchema,
    operationalOverhead: tradeOffLevelSchema,
});

export const decisionResultSchema = z.object({
    category: z.enum(['compute', 'secrets', 'cicd']),
    recommended: z.string(),
    alternatives: z.array(z.string()),
    tradeOffs: tradeOffsSchema,
});

export const decisionsResponseSchema = z.object({
    compute: decisionResultSchema.extend({category: z.literal('compute')}),
    secrets: decisionResultSchema.extend({category: z.literal('secrets')}),
    cicd: decisionResultSchema.extend({category: z.literal('cicd')}),
});

export const evaluateDecisionsApiResponseSchema = z.object({
    decisions: decisionsResponseSchema,
});

export type TradeOffLevel = z.infer<typeof tradeOffLevelSchema>;
export type TradeOffs = z.infer<typeof tradeOffsSchema>;
export type DecisionCategory = z.infer<typeof decisionResultSchema>['category'];
export type DecisionResult = z.infer<typeof decisionResultSchema>;
export type DecisionsResponse = z.infer<typeof decisionsResponseSchema>;
export type EvaluateDecisionsApiResponse = z.infer<typeof evaluateDecisionsApiResponseSchema>;
