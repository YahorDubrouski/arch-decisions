import type {ProjectContext} from '@/domain/context.js';
import {getContextValidationErrors, validateContext} from '@/domain/context.js';
import type {DecisionsResponse} from '@/domain/DecisionsResponse.js';
import {parseDecisionsResponse} from '@/validators/schemas/DecisionsResponseSchema.js';
import type {ValidationResult} from '@/validators/http/validation-result.js';
import {parseRequestObject, validationFailure} from '@/validators/http/validation-result.js';

export interface GenerateArchitectureDecisionRequest {
    context: ProjectContext;
    decisions: DecisionsResponse;
}

export function validateGenerateArchitectureDecisionRequest(
    body: unknown
): ValidationResult<GenerateArchitectureDecisionRequest> {
    const payload = parseRequestObject(body);
    if (!payload) {
        return validationFailure(['Request body must be an object']);
    }

    const errors: string[] = [];

    if (!validateContext(payload.context)) {
        errors.push(...getContextValidationErrors(payload.context).map((message) => `context.${message}`));
    }

    const parsedDecisions = parseDecisionsResponse(payload.decisions);
    if (!parsedDecisions.ok) {
        return {
            success: false,
            errors: parsedDecisions.errors.map((message) => `decisions.${message}`),
        };
    }

    if (errors.length > 0) {
        return validationFailure(errors);
    }

    return {
        success: true,
        data: {
            context: payload.context as ProjectContext,
            decisions: parsedDecisions.data,
        },
    };
}
