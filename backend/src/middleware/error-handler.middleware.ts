import type {NextFunction, Request, Response} from 'express';
import {AppError} from '@/lib/errors/app-error.js';
import logger from '@/lib/logging/logger.js';
import {getCorrelationId} from '@/middleware/correlation-id.middleware.js';

export function errorHandlerMiddleware(
    error: unknown,
    request: Request,
    response: Response,
    _next: NextFunction
): void {
    const correlationId = getCorrelationId(request);

    if (error instanceof AppError) {
        logger.warn('Request failed with application error', {
            correlationId,
            statusCode: error.statusCode,
            message: error.message,
            details: error.details,
            path: request.path,
        });
        response.status(error.statusCode).json({
            error: error.message,
            details: error.details,
            correlationId,
        });
        return;
    }

    logger.error('Unhandled request error', {
        correlationId,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        path: request.path,
    });

    response.status(500).json({
        error: 'Internal server error',
        correlationId,
    });
}
