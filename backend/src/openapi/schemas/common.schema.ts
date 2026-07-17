import {z} from '../zod.js';

export const HealthResponseSchema = z
    .object({
        status: z.string().openapi({example: 'ok'}),
        message: z.string(),
    })
    .openapi('HealthResponse');

export const ErrorResponseSchema = z
    .object({
        error: z.string(),
        details: z.unknown().optional(),
        correlationId: z.string().optional().openapi({
            description: 'Request correlation id from x-request-id when available.',
        }),
    })
    .openapi('ErrorResponse');
