import type {Express} from 'express';
import type {DecisionsController} from '../controllers/decisions.controller.js';

export function registerDecisionsRoutes(app: Express, decisionsController: DecisionsController): void {
  app.post('/api/decisions/evaluate', (request, response) => {
    void decisionsController.handlePostDecisionsEvaluation(request, response);
  });
}
