import type {ArchitectureDecisionsController} from '@/controllers/architecture-decisions.controller.js';
import type {ApiRouter} from '@/lib/http/api-router.js';

export function registerGetRoute(
    api: ApiRouter,
    architectureDecisionsController: ArchitectureDecisionsController
): void {
    api.get('/api/architecture-decisions/:decisionId', (request, response) =>
        architectureDecisionsController.get(request, response)
    );
}
