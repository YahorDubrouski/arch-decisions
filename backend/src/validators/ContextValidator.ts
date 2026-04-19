// Validation layer: validates request context (uses domain validation)

import type {ProjectContext} from '../domain/context.js';
import {validateContext} from '../domain/context.js';

export interface ValidationSuccess {
    success: true;
    context: ProjectContext;
}

export interface ValidationFailure {
    success: false;
    errors: string[];
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validates context from request body. Rejects invalid context with error messages.
 */
export function validateRequestContext(body: unknown): ValidationResult {
    if (!validateContext(body)) {
        const errors = getValidationErrors(body);
        return {success: false, errors};
    }
    return {success: true, context: body as ProjectContext};
}

function getValidationErrors(value: unknown): string[] {
    const errors: string[] = [];
    if (typeof value !== 'object' || value === null) {
        errors.push('Context must be an object');
        return errors;
    }

    const ctx = value as Record<string, unknown>;

    if (ctx.teamSize === undefined || !['1-5', '6-20', '21-50', '50+'].includes(String(ctx.teamSize))) {
        errors.push('teamSize is required and must be one of: 1-5, 6-20, 21-50, 50+');
    }
    if (
        ctx.trafficPattern === undefined ||
        !['low-steady', 'variable', 'high-spike', 'unpredictable'].includes(String(ctx.trafficPattern))
    ) {
        errors.push('trafficPattern is required and must be one of: low-steady, variable, high-spike, unpredictable');
    }
    if (
        ctx.budgetSensitivity === undefined ||
        !['cost-optimized', 'balanced', 'performance-first'].includes(String(ctx.budgetSensitivity))
    ) {
        errors.push('budgetSensitivity is required and must be one of: cost-optimized, balanced, performance-first');
    }
    if (!Array.isArray(ctx.complianceRequirements)) {
        errors.push('complianceRequirements must be an array');
    }
    if (
        ctx.operationalMaturity === undefined ||
        !['minimal', 'moderate', 'advanced', 'enterprise'].includes(String(ctx.operationalMaturity))
    ) {
        errors.push('operationalMaturity is required and must be one of: minimal, moderate, advanced, enterprise');
    }

    return errors;
}
