import {z} from '../zod.js';

export const HealthResponseSchema = z
    .object({
        status: z.string().openapi({example: 'ok'}),
        message: z.string(),
    })
    .openapi('HealthResponse');
