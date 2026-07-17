import type {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {HealthResponseSchema} from '@/openapi/schemas/index.js';

export function registerHealthOpenApi(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'get',
        path: '/health',
        tags: ['health'],
        summary: 'Health check',
        description: 'Liveness probe for the Express API process.',
        responses: {
            200: {
                description: 'Service is up',
                content: {
                    'application/json': {
                        schema: HealthResponseSchema,
                    },
                },
            },
        },
    });
}
