import type {Request, Response} from 'express';
import logger from '@/lib/logging/logger.js';
import {validateGenerateArchitectureDecisionRequest} from '@/validators/http/generate-architecture-decision-request.schema.js';
import {GenerateArchitectureDecisionService} from '@/services/architecture-decisions/generate-architecture-decision.service.js';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.js';

export class ArchitectureDecisionsController {
    constructor(
        private readonly generateArchitectureDecisionService: GenerateArchitectureDecisionService,
        private readonly architectureDecisionRepository: ArchitectureDecisionRepository
    ) {}

    async post(request: Request, response: Response): Promise<void> {
        try {
            const validationOutcome = validateGenerateArchitectureDecisionRequest(request.body);
            if (!validationOutcome.success) {
                this.sendBadRequestForInvalidGeneratePayload(response, validationOutcome.errors, request.body);
                return;
            }

            const {context, decisions} = validationOutcome.data;
            logger.info('Architecture decision generation started', {
                teamSize: context.teamSize,
                computeRecommendation: decisions.compute.recommended,
            });

            const architectureDecision = await this.generateArchitectureDecisionService.generate(
                context,
                decisions
            );

            logger.info('Architecture decision generation completed', {
                decisionId: architectureDecision.id,
                title: architectureDecision.title,
            });
            this.sendCreatedWithArchitectureDecision(response, architectureDecision);
        } catch (error) {
            this.sendInternalErrorForGenerationFailure(response, request.body, error);
        }
    }

    get(request: Request, response: Response): void {
        try {
            const decisionId = request.params.decisionId;
            if (!decisionId) {
                this.sendBadRequestForMissingDecisionId(response);
                return;
            }

            const architectureDecision = this.architectureDecisionRepository.findById(decisionId);
            if (!architectureDecision) {
                this.sendNotFoundForMissingArchitectureDecision(response, decisionId);
                return;
            }

            this.sendOkWithArchitectureDecision(response, architectureDecision);
        } catch (error) {
            this.sendInternalErrorForRetrievalFailure(response, request.params.decisionId, error);
        }
    }

    private sendBadRequestForInvalidGeneratePayload(
        response: Response,
        validationErrors: string[],
        requestBody: unknown
    ): void {
        logger.warn('Rejected architecture decision generation: invalid request payload', {
            validationErrors,
            requestBody,
        });
        response.status(400).json({error: 'Invalid architecture decision request', details: validationErrors});
    }

    private sendBadRequestForMissingDecisionId(response: Response): void {
        response.status(400).json({error: 'Architecture decision id is required'});
    }

    private sendNotFoundForMissingArchitectureDecision(response: Response, decisionId: string): void {
        logger.info('Architecture decision not found', {decisionId});
        response.status(404).json({error: 'Architecture decision not found'});
    }

    private sendCreatedWithArchitectureDecision(response: Response, architectureDecision: unknown): void {
        response.status(201).json({architectureDecision});
    }

    private sendOkWithArchitectureDecision(response: Response, architectureDecision: unknown): void {
        response.status(200).json({architectureDecision});
    }

    private sendInternalErrorForGenerationFailure(
        response: Response,
        requestBody: unknown,
        error: unknown
    ): void {
        logger.error('Architecture decision generation failed', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            requestBody,
        });
        response.status(500).json({error: 'Internal server error'});
    }

    private sendInternalErrorForRetrievalFailure(
        response: Response,
        decisionId: string | undefined,
        error: unknown
    ): void {
        logger.error('Architecture decision retrieval failed', {
            decisionId,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        response.status(500).json({error: 'Internal server error'});
    }
}
