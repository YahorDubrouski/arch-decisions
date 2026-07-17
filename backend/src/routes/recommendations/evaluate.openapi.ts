import type {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {
    ErrorResponseSchema,
    EvaluateRecommendationsRequestSchema,
    JobAcceptedSchema,
    ProjectContextSchema,
} from '@/openapi/schemas/index.js';
import {z} from '@/openapi/zod.js';

export function registerEvaluateOpenApi(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'post',
        path: '/api/recommendations/evaluate',
        tags: ['recommendations'],
        summary: 'Enqueue recommendation evaluation',
        description:
            'Validates project context and returns 202 with a jobId. Poll GET /api/jobs/{jobId} for results. ' +
            'Body may be `{ "context": {…} }` or a bare project context object.',
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: z.union([EvaluateRecommendationsRequestSchema, ProjectContextSchema]),
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
                description: 'Invalid project context',
                content: {
                    'application/json': {
                        schema: ErrorResponseSchema,
                    },
                },
            },
        },
    });
}
