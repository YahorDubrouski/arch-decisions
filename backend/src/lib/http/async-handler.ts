import type {NextFunction, Request, RequestHandler, Response} from 'express';

export type RouteHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => void | Promise<void>;

/**
 * Wraps a route handler so thrown errors (sync or async) reach the global error middleware.
 * Prefer createApiRouter for route registration (it applies this automatically).
 * Example: handler throws NotFoundError → next(error) → errorHandlerMiddleware → 404 JSON.
 */
export function asyncHandler(handler: RouteHandler): RequestHandler {
    return (request, response, next) => {
        // Promise.resolve covers both sync returns and async Promises.
        void Promise.resolve(handler(request, response, next)).catch(next);
    };
}
