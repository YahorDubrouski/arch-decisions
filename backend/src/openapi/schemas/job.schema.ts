import {z} from '../zod.js';

export const JobAcceptedSchema = z
    .object({
        jobId: z.string().openapi({
            description: 'Poll GET /api/jobs/{jobId} until status is completed or failed.',
            example: '2fa0a036-613d-4ed9-8d84-cf96352cb68b',
        }),
    })
    .openapi('JobAccepted');

export const ArchitectureJobStatusViewSchema = z
    .object({
        jobId: z.string(),
        type: z.string().openapi({description: 'Job type name, e.g. evaluate-recommendations.'}),
        status: z.enum(['waiting', 'active', 'completed', 'failed', 'delayed', 'unknown']),
        result: z.unknown().optional(),
        error: z.string().optional(),
    })
    .openapi('ArchitectureJobStatusView');

export const JobStatusResponseSchema = z
    .object({
        job: ArchitectureJobStatusViewSchema,
    })
    .openapi('JobStatusResponse');
