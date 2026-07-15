import type {Express} from 'express';
import type {ArchitectureDecisionsController} from '@/controllers/architecture-decisions.controller.js';

export function registerArchitectureDecisionsRoutes(
    app: Express,
    architectureDecisionsController: ArchitectureDecisionsController
): void {
    app.post('/api/architecture-decisions/generate', (request, response) => {
        void architectureDecisionsController.post(request, response);
    });

    app.get('/api/architecture-decisions/:decisionId', (request, response) => {
        architectureDecisionsController.get(request, response);
    });
}
