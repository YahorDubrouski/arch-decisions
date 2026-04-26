// Validation adapter: Zod schema for internal DecisionsResponse contract.

import { z } from 'zod';
import type { DecisionsResponse } from '../../domain/DecisionsResponse.js';

const tradeOffLevelSchema = z.enum(['low', 'medium', 'high']);

const tradeOffsSchema = z.object({
  cost: tradeOffLevelSchema,
  complexity: tradeOffLevelSchema,
  risk: tradeOffLevelSchema,
  operationalOverhead: tradeOffLevelSchema,
});

const decisionResultSchema = z.object({
  category: z.enum(['compute', 'secrets', 'cicd']),
  recommended: z.string(),
  alternatives: z.array(z.string()),
  tradeOffs: tradeOffsSchema,
});

export const decisionsResponseSchema = z.object({
  compute: decisionResultSchema.extend({ category: z.literal('compute') }),
  secrets: decisionResultSchema.extend({ category: z.literal('secrets') }),
  cicd: decisionResultSchema.extend({ category: z.literal('cicd') }),
});

export function parseDecisionsResponse(
  input: unknown
): { ok: true; data: DecisionsResponse } | { ok: false; errors: string[] } {
  const parsed = decisionsResponseSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, data: parsed.data as DecisionsResponse };
  }
  return {
    ok: false,
    errors: parsed.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'decisions';
      return `${path}: ${issue.message}`;
    }),
  };
}
