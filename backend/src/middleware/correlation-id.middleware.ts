import type {NextFunction, Request, Response} from 'express';
import {randomUUID} from 'node:crypto';

// Industry HTTP header name; the value is our correlation ID for this request’s story in logs/errors.
export const CORRELATION_ID_HEADER = 'x-request-id';

type RequestWithCorrelationId = Request & {correlationId?: string};

/**
 * Gives each HTTP call a correlation ID so logs and error responses can be matched.
 * Reuses the client’s x-request-id when present; otherwise creates a new UUID.
 * Example: client sends x-request-id "abc" → logs and JSON errors include correlationId "abc";
 * no header → we generate one like "f3a1…" and echo it on the response as x-request-id.
 */
export function correlationIdMiddleware(request: Request, response: Response, next: NextFunction): void {
    const incomingCorrelationId = request.header(CORRELATION_ID_HEADER);
    const correlationId = incomingCorrelationId?.trim() || randomUUID();

    response.setHeader(CORRELATION_ID_HEADER, correlationId);
    (request as RequestWithCorrelationId).correlationId = correlationId;
    next();
}

export function getCorrelationId(request: Request): string | undefined {
    return (request as RequestWithCorrelationId).correlationId;
}
