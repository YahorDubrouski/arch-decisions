import type {ArchitectureDecisionsController} from '@/controllers/architecture-decisions.controller.js';
import type {ApiRouter} from '@/lib/http/api-router.js';

export function registerListRoute(
    api: ApiRouter,
    architectureDecisionsController: ArchitectureDecisionsController
): void {
    api.get('/api/architecture-decisions', (request, response) =>
        architectureDecisionsController.list(request, response)
    );
}
