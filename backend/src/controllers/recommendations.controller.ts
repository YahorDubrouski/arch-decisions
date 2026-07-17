import type {Request, Response} from 'express';
import {BadRequestError} from '@/lib/errors/app-error.js';
import logger from '@/lib/logging/logger.js';
import {validateEvaluateRecommendationsRequest} from '@/validators/http/evaluate-recommendations-request.schema.js';
import type {EnqueueArchitectureJobService} from '@/services/jobs/enqueue-architecture-job.service.js';

export class RecommendationsController {
    constructor(private readonly enqueueArchitectureJobService: EnqueueArchitectureJobService) {}

    async post(request: Request, response: Response): Promise<void> {
        const unvalidatedContextPayload = this.readProjectContextFromRequestBody(request.body);
        const validationOutcome = validateEvaluateRecommendationsRequest(unvalidatedContextPayload);
        if (!validationOutcome.success) {
            throw new BadRequestError('Invalid context', validationOutcome.errors);
        }

        const validatedProjectContext = validationOutcome.data;
        logger.info('Enqueueing recommendations evaluation job', {
            teamSize: validatedProjectContext.teamSize,
            trafficPattern: validatedProjectContext.trafficPattern,
        });

        const jobId = await this.enqueueArchitectureJobService.enqueueEvaluateRecommendations(
            validatedProjectContext
        );

        response.status(202).json({jobId});
    }

    private readProjectContextFromRequestBody(body: unknown): unknown {
        if (body !== null && typeof body === 'object' && 'context' in body) {
            return (body as {context: unknown}).context;
        }
        return body;
    }
}
