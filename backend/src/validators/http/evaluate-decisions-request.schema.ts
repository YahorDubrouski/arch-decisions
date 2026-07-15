import type {ProjectContext} from '@/domain/context.js';
import {getContextValidationErrors, validateContext} from '@/domain/context.js';
import type {ValidationResult} from '@/validators/http/validation-result.js';
import {validationFailure} from '@/validators/http/validation-result.js';

export function validateEvaluateDecisionsRequest(body: unknown): ValidationResult<ProjectContext> {
    if (!validateContext(body)) {
        return validationFailure(getContextValidationErrors(body));
    }

    return {success: true, data: body as ProjectContext};
}
