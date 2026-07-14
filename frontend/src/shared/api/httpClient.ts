const API_BASE = import.meta.env.VITE_API_URL ?? '';

interface HttpErrorPayload {
    message?: string;
}

export class HttpClientError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = 'HttpClientError';
    }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
    try {
        const payload = (await response.json()) as HttpErrorPayload;
        return payload?.message ?? fallback;
    } catch {
        return fallback;
    }
}

export async function postJson<TRequestBody, TResponseBody = void>(
    path: string,
    body: TRequestBody
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

    return (await response.json()) as TResponseBody;
}

export async function getJson<TResponseBody>(path: string): Promise<TResponseBody | null> {
    const response = await fetch(`${API_BASE}${path}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const message = await parseErrorMessage(response, `GET ${path} failed (${response.status})`);
        throw new HttpClientError(message, response.status);
    }

    return (await response.json()) as TResponseBody;
}
