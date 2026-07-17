// Validation adapter: Zod schema for internal RecommendationsResponse contract.

import {z} from 'zod';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';

const tradeOffLevelSchema = z.enum(['low', 'medium', 'high']);

const tradeOffsSchema = z.object({
    cost: tradeOffLevelSchema,
    complexity: tradeOffLevelSchema,
    risk: tradeOffLevelSchema,
    operationalOverhead: tradeOffLevelSchema,
});

const recommendationResultSchema = z.object({
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

export function parseRecommendationsResponse(
    input: unknown
): {ok: true; data: RecommendationsResponse} | {ok: false; errors: string[]} {
    const parsed = recommendationsResponseSchema.safeParse(input);
    if (parsed.success) {
        return {ok: true, data: parsed.data as RecommendationsResponse};
    }
    return {
        ok: false,
        errors: parsed.error.issues.map((issue) => {
            const path = issue.path.length > 0 ? issue.path.join('.') : 'recommendations';
            return `${path}: ${issue.message}`;
        }),
    };
}
