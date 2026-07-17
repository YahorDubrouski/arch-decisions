import type {ProjectContext} from '@/domain/context.js';
import {getContextValidationErrors, validateContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import {parseRecommendationsResponse} from '@/validators/schemas/RecommendationsResponseSchema.js';
import type {ValidationResult} from '@/validators/http/validation-result.js';
import {parseRequestObject, validationFailure} from '@/validators/http/validation-result.js';

export interface GenerateArchitectureDecisionRequest {
    context: ProjectContext;
    recommendations: RecommendationsResponse;
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

    const parsedRecommendations = parseRecommendationsResponse(payload.recommendations);
    if (!parsedRecommendations.ok) {
        return {
            success: false,
            errors: parsedRecommendations.errors.map((message) => `recommendations.${message}`),
        };
    }

    if (errors.length > 0) {
        return validationFailure(errors);
    }

    return {
        success: true,
        data: {
            context: payload.context as ProjectContext,
            recommendations: parsedRecommendations.data,
        },
    };
}
