import type {ArchitectureDecisionsController} from '@/controllers/architecture-decisions.controller.js';
import type {ApiRouter} from '@/lib/http/api-router.js';

export function registerGenerateRoute(
    api: ApiRouter,
    architectureDecisionsController: ArchitectureDecisionsController
): void {
    api.post('/api/architecture-decisions/generate', (request, response) =>
        architectureDecisionsController.post(request, response)
    );
}
