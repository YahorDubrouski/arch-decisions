import type {Express} from 'express';
import {asyncHandler, type RouteHandler} from '@/lib/http/async-handler.js';

/**
 * Registers API routes with automatic async/sync error forwarding.
 * Example: api.get('/api/jobs/:id', …) throws → error middleware; no per-route wrap needed.
 */
export type ApiRouter = {
    get(path: string, handler: RouteHandler): void;
    post(path: string, handler: RouteHandler): void;
    put(path: string, handler: RouteHandler): void;
    patch(path: string, handler: RouteHandler): void;
    delete(path: string, handler: RouteHandler): void;
};

export function createApiRouter(app: Express): ApiRouter {
    return {
        get(path, handler) {
            app.get(path, asyncHandler(handler));
        },
        post(path, handler) {
            app.post(path, asyncHandler(handler));
        },
        put(path, handler) {
            app.put(path, asyncHandler(handler));
        },
        patch(path, handler) {
            app.patch(path, asyncHandler(handler));
        },
        delete(path, handler) {
            app.delete(path, asyncHandler(handler));
        },
    };
}
