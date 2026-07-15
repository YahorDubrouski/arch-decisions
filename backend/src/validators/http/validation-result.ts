export type ValidationResult<T> =
    | {success: true; data: T}
    | {success: false; errors: string[]};

export function validationFailure(errors: string[]): ValidationResult<never> {
    return {success: false, errors};
}

export function parseRequestObject(body: unknown): Record<string, unknown> | null {
    if (typeof body !== 'object' || body === null) {
        return null;
    }

    return body as Record<string, unknown>;
}
