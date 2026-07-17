import type {ArchitectureDecisionsController} from '@/controllers/architecture-decisions.controller.js';
import type {ApiRouter} from '@/lib/http/api-router.js';

export function registerArchitectureDecisionsRoutes(
    api: ApiRouter,
    architectureDecisionsController: ArchitectureDecisionsController
): void {
    api.post('/api/architecture-decisions/generate', (request, response) =>
        architectureDecisionsController.post(request, response)
    );

    api.get('/api/architecture-decisions', (request, response) =>
        architectureDecisionsController.list(request, response)
    );

    api.get('/api/architecture-decisions/:decisionId', (request, response) =>
        architectureDecisionsController.get(request, response)
    );
}
