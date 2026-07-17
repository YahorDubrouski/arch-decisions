import type {Request, Response} from 'express';
import {BadRequestError, NotFoundError} from '@/lib/errors/app-error.js';
import {readPathParam} from '@/lib/http/read-path-param.js';
import logger from '@/lib/logging/logger.js';
import {validateGenerateArchitectureDecisionRequest} from '@/validators/http/generate-architecture-decision-request.schema.js';
import type {EnqueueArchitectureJobService} from '@/services/jobs/enqueue-architecture-job.service.js';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.js';

export class ArchitectureDecisionsController {
    constructor(
        private readonly enqueueArchitectureJobService: EnqueueArchitectureJobService,
        private readonly architectureDecisionRepository: ArchitectureDecisionRepository
    ) {}

    async post(request: Request, response: Response): Promise<void> {
        const validationOutcome = validateGenerateArchitectureDecisionRequest(request.body);
        if (!validationOutcome.success) {
            throw new BadRequestError('Invalid architecture decision request', validationOutcome.errors);
        }

        const {context, recommendations} = validationOutcome.data;
        logger.info('Enqueueing architecture decision generation job', {
            teamSize: context.teamSize,
            computeRecommendation: recommendations.compute.recommended,
        });

        const jobId = await this.enqueueArchitectureJobService.enqueueGenerateArchitectureDecision(
            context,
            recommendations
        );

        response.status(202).json({jobId});
    }

    list(request: Request, response: Response): void {
        const search = typeof request.query.search === 'string' ? request.query.search : undefined;
        const status = typeof request.query.status === 'string' ? request.query.status : undefined;
        const architectureDecisions = this.architectureDecisionRepository.list({search, status});
        response.status(200).json({architectureDecisions});
    }

    get(request: Request, response: Response): void {
        const decisionId = readPathParam(request.params.decisionId, 'Architecture decision id');

        const architectureDecision = this.architectureDecisionRepository.findById(decisionId);
        if (!architectureDecision) {
            throw new NotFoundError('Architecture decision not found');
        }

        response.status(200).json({architectureDecision});
    }
}
