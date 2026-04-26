import express from 'express';
import cors from 'cors';
import {registerHealthRoutes} from './routes/health.routes.js';
import {registerDecisionsRoutes} from './routes/decisions.routes.js';
import {DecisionsController} from './controllers/decisions.controller.js';
import {EvaluateDecisionsService} from './services/decisions/evaluate-decisions.service.js';
import {OpenAIDecisionsProvider} from './integrations/openai/openai-decisions.provider.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const decisionProvider = new OpenAIDecisionsProvider();
  const evaluateDecisionsService = new EvaluateDecisionsService(decisionProvider);
  const decisionsController = new DecisionsController(evaluateDecisionsService);

  registerHealthRoutes(app);
  registerDecisionsRoutes(app, decisionsController);

  return app;
}
