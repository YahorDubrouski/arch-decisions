import type {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {ArchitectureDecisionResponseSchema, ErrorResponseSchema} from '@/openapi/schemas/index.js';
import {z} from '@/openapi/zod.js';

export function registerGetOpenApi(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'get',
        path: '/api/architecture-decisions/{decisionId}',
        tags: ['architecture-decisions'],
        summary: 'Get architecture decision by id',
        request: {
            params: z.object({
                decisionId: z.string().openapi({description: 'Architecture decision id.'}),
            }),
        },
        responses: {
            200: {
                description: 'Architecture decision found',
                content: {
                    'application/json': {
                        schema: ArchitectureDecisionResponseSchema,
                    },
                },
            },
            404: {
                description: 'Not found',
                content: {
                    'application/json': {
                        schema: ErrorResponseSchema,
                    },
                },
            },
        },
    });
}
