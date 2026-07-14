import {z, ZodType} from 'zod';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

interface HttpErrorPayload {
    message?: string;
    error?: string;
    details?: unknown;
}

export class HttpClientError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = 'HttpClientError';
    }
}

function formatHttpErrorPayload(payload: HttpErrorPayload, fallback: string): string {
    const baseMessage = payload.error ?? payload.message ?? fallback;

    if (Array.isArray(payload.details) && payload.details.length > 0) {
        return `${baseMessage}: ${payload.details.join('; ')}`;
    }

    return baseMessage;
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
    try {
        const payload = (await response.json()) as HttpErrorPayload;
        return formatHttpErrorPayload(payload, fallback);
    } catch {
        return fallback;
    }
}

export function resolveSubmitError(error: unknown): string {
    if (error instanceof HttpClientError) {
        if (error.status >= 500) {
            return 'Server error. Please try again.';
        }

        return error.message;
    }

    if (error instanceof z.ZodError) {
        return 'Received an invalid response from the server.';
    }

    if (error instanceof TypeError || (error instanceof Error && error.message === 'Failed to fetch')) {
        return 'Could not reach the server. Check that backend is running.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Failed to submit context';
}

async function parseJsonResponse<TResponseBody>(
    response: Response,
    responseSchema?: ZodType<TResponseBody>
): Promise<TResponseBody> {
    const json: unknown = await response.json();

    if (responseSchema) {
        return responseSchema.parse(json);
    }

    return json as TResponseBody;
}

export async function postJson<TRequestBody, TResponseBody = void>(
    path: string,
    body: TRequestBody,
    responseSchema?: ZodType<TResponseBody>
): Promise<TResponseBody> {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const message = await parseErrorMessage(response, `POST ${path} failed (${response.status})`);
        throw new HttpClientError(message, response.status);
    }

    if (response.status === 204) {
        return undefined as TResponseBody;
    }

    return parseJsonResponse(response, responseSchema);
}

export async function getJson<TResponseBody>(
    path: string,
    responseSchema?: ZodType<TResponseBody>
): Promise<TResponseBody | null> {
    const response = await fetch(`${API_BASE}${path}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const message = await parseErrorMessage(response, `GET ${path} failed (${response.status})`);
        throw new HttpClientError(message, response.status);
    }

    return parseJsonResponse(response, responseSchema);
}
