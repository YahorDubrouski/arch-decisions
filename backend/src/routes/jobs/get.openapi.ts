import type {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {ErrorResponseSchema, JobStatusResponseSchema} from '@/openapi/schemas/index.js';
import {z} from '@/openapi/zod.js';

export function registerGetJobOpenApi(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'get',
        path: '/api/jobs/{jobId}',
        tags: ['jobs'],
        summary: 'Get job status',
        description: 'Poll until status is completed or failed. Result appears when completed.',
        request: {
            params: z.object({
                jobId: z
                    .string()
                    .openapi({description: 'Job id returned from a 202 enqueue response.'}),
            }),
        },
        responses: {
            200: {
                description: 'Job status snapshot',
                content: {
                    'application/json': {
                        schema: JobStatusResponseSchema,
                    },
                },
            },
            404: {
                description: 'Job not found',
                content: {
                    'application/json': {
                        schema: ErrorResponseSchema,
                    },
                },
            },
        },
    });
}
