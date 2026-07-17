import {BadRequestError} from '@/lib/errors/app-error.js';

/**
 * Express 5 types path params as string | string[]. We only accept a single string value.
 * Example: params.jobId "abc" → "abc"; missing or ["a","b"] → BadRequestError.
 */
export function readPathParam(
    value: string | string[] | undefined,
    paramName: string
): string {
    if (typeof value === 'string' && value.trim() !== '') {
        return value;
    }

    throw new BadRequestError(`${paramName} is required`);
}
