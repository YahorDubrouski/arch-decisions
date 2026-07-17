import type {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {ArchitectureDecisionListResponseSchema} from '@/openapi/schemas/index.js';
import {z} from '@/openapi/zod.js';

export function registerListOpenApi(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'get',
        path: '/api/architecture-decisions',
        tags: ['architecture-decisions'],
        summary: 'List architecture decisions',
        description: 'Returns saved ADRs, optionally filtered by search text and status.',
        request: {
            query: z.object({
                search: z
                    .string()
                    .optional()
                    .openapi({description: 'Case-insensitive title/summary match.'}),
                status: z
                    .string()
                    .optional()
                    .openapi({description: 'Filter by ADR status (e.g. proposed).'}),
            }),
        },
        responses: {
            200: {
                description: 'List of architecture decisions',
                content: {
                    'application/json': {
                        schema: ArchitectureDecisionListResponseSchema,
                    },
                },
            },
        },
    });
}
