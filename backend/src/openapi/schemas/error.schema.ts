import {z} from '../zod.js';

export const ErrorResponseSchema = z
    .object({
        error: z.string(),
        details: z.unknown().optional(),
        correlationId: z.string().optional().openapi({
            description: 'Request correlation id from x-request-id when available.',
        }),
    })
    .openapi('ErrorResponse');
