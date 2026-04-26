import type {Request, Response} from 'express';
import type {DecisionsResponse} from '../domain/DecisionsResponse.js';
import logger from '../lib/logging/logger.js';
import {validateEvaluateDecisionsRequest} from '../validators/http/evaluate-decisions-request.schema.js';
import {EvaluateDecisionsService} from '../services/decisions/evaluate-decisions.service.js';

export class DecisionsController {
  constructor(private readonly evaluateDecisionsService: EvaluateDecisionsService) {}

  async handlePostDecisionsEvaluation(request: Request, response: Response): Promise<void> {
    try {
      const unvalidatedContextPayload = this.readProjectContextFromRequestBody(request.body);
      const validationOutcome = validateEvaluateDecisionsRequest(unvalidatedContextPayload);
      if (!validationOutcome.success) {
        this.sendBadRequestForInvalidContext(response, validationOutcome.errors, request.body);
        return;
      }

      const validatedProjectContext = validationOutcome.context;
      this.logArchitectureEvaluationStarted(validatedProjectContext);
      const architectureDecisions = await this.evaluateDecisionsService.evaluateAll(validatedProjectContext);
      this.logArchitectureEvaluationSucceeded(architectureDecisions);
      this.sendOkWithDecisions(response, architectureDecisions);
    } catch (error) {
      this.sendInternalErrorForEvaluationFailure(response, request.body, error);
    }
  }

  private readProjectContextFromRequestBody(body: unknown): unknown {
    if (body !== null && typeof body === 'object' && 'context' in body) {
      return (body as {context: unknown}).context;
    }
    return body;
  }

  private sendBadRequestForInvalidContext(response: Response, validationErrors: string[], requestBody: unknown): void {
    logger.warn('Rejected decisions evaluation: invalid project context', {validationErrors, requestBody});
    response.status(400).json({error: 'Invalid context', details: validationErrors});
  }

  private logArchitectureEvaluationStarted(context: {teamSize: string; trafficPattern: string;}): void {
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

  private sendInternalErrorForEvaluationFailure(response: Response, requestBody: unknown, error: unknown): void {
    logger.error('Architecture decisions evaluation failed', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      requestBody,
    });
    response.status(500).json({error: 'Internal server error'});
  }
}
