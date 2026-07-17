import type {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {
    ErrorResponseSchema,
    GenerateArchitectureDecisionRequestSchema,
    JobAcceptedSchema,
} from '@/openapi/schemas/index.js';

export function registerGenerateOpenApi(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'post',
        path: '/api/architecture-decisions/generate',
        tags: ['architecture-decisions'],
        summary: 'Enqueue ADR generation',
        description:
            'Validates context + recommendations and returns 202 with a jobId. ' +
            'Poll GET /api/jobs/{jobId} for the generated Architecture Decision Record.',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: GenerateArchitectureDecisionRequestSchema,
                    },
                },
            },
        },
        responses: {
            202: {
                description: 'Job accepted',
                content: {
                    'application/json': {
                        schema: JobAcceptedSchema,
                    },
                },
            },
            400: {
                description: 'Invalid request body',
                content: {
                    'application/json': {
                        schema: ErrorResponseSchema,
                    },
                },
            },
        },
    });
}
