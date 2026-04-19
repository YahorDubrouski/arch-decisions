// Controller: HTTP adapter only — validates input, delegates to DecisionService, maps results to HTTP.

import type {Request, Response} from 'express';
import type {DecisionsResponse} from '../services/ai/types.js';
import {DecisionService} from '../services/DecisionService.js';
import logger from '../lib/logging/logger.js';
import {validateRequestContext} from '../validators/ContextValidator.js';

export class DecisionController {
    constructor(private readonly architectureDecisionService: DecisionService) {
    }

    /**
     * Handles POST /api/decisions/evaluate: validates project context, returns architecture recommendations.
     */
    async handlePostDecisionsEvaluation(request: Request, response: Response): Promise<void> {
        try {
            const unvalidatedContextPayload = this.readProjectContextFromRequestBody(request.body);
            const validationOutcome = validateRequestContext(unvalidatedContextPayload);
            if (!validationOutcome.success) {
                this.sendBadRequestForInvalidContext(response, validationOutcome.errors, request.body);
                return;
            }

            const validatedProjectContext = validationOutcome.context;
            this.logArchitectureEvaluationStarted(validatedProjectContext);

            const architectureDecisions =
                await this.architectureDecisionService.evaluateAll(validatedProjectContext);

            this.logArchitectureEvaluationSucceeded(architectureDecisions);
            this.sendOkWithDecisions(response, architectureDecisions);
        } catch (error) {
            this.sendInternalErrorForEvaluationFailure(response, request.body, error);
        }
    }

    /**
     * Supports `{ context: ProjectContext }` (contract) and a bare body (convenience for tools / older clients).
     */
    private readProjectContextFromRequestBody(body: unknown): unknown {
        if (body !== null && typeof body === 'object' && 'context' in body) {
            return (body as { context: unknown }).context;
        }
        return body;
    }

    private sendBadRequestForInvalidContext(
        response: Response,
        validationErrors: string[],
        requestBody: unknown
    ): void {
        logger.warn('Rejected decisions evaluation: invalid project context', {
            validationErrors,
            requestBody,
        });
        response.status(400).json({error: 'Invalid context', details: validationErrors});
    }

    private logArchitectureEvaluationStarted(context: {
        teamSize: string;
        trafficPattern: string;
    }): void {
        logger.info('Architecture decisions evaluation started', {
            teamSize: context.teamSize,
            trafficPattern: context.trafficPattern,
        });
    }

    private logArchitectureEvaluationSucceeded(decisions: DecisionsResponse): void {
        logger.info('Architecture decisions evaluation completed', {
            computeRecommendation: decisions.compute.recommended,
            secretsRecommendation: decisions.secrets.recommended,
            cicdRecommendation: decisions.cicd.recommended,
        });
    }

    private sendOkWithDecisions(response: Response, decisions: DecisionsResponse): void {
        response.status(200).json({decisions});
    }

    private sendInternalErrorForEvaluationFailure(
        response: Response,
        requestBody: unknown,
        error: unknown
    ): void {
        logger.error('Architecture decisions evaluation failed', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            requestBody,
        });
        response.status(500).json({error: 'Internal server error'});
    }
}
