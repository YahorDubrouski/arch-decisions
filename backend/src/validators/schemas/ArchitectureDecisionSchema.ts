import {z} from 'zod';
import type {ArchitectureDecision} from '@/domain/architecture-decision.js';
import {architectureDecisionStatus} from '@/domain/architecture-decision.js';

export const architectureDecisionStatusSchema = z.literal(architectureDecisionStatus);

export const architectureDecisionSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    status: architectureDecisionStatusSchema,
    content: z.string().min(1),
    summary: z.string().min(1),
    createdAt: z.string().min(1),
});

export const architectureDecisionDraftSchema = z.object({
    title: z.string().min(1),
    status: architectureDecisionStatusSchema,
    content: z.string().min(1),
    summary: z.string().min(1),
});

export function parseArchitectureDecision(
    input: unknown
): {ok: true; data: ArchitectureDecision} | {ok: false; errors: string[]} {
    const parsed = architectureDecisionSchema.safeParse(input);
    if (parsed.success) {
        return {ok: true, data: parsed.data as ArchitectureDecision};
    }

    return {
        ok: false,
        errors: parsed.error.issues.map((issue) => {
            const path = issue.path.length > 0 ? issue.path.join('.') : 'architectureDecision';
            return `${path}: ${issue.message}`;
        }),
    };
}
