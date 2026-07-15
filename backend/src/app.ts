import express from 'express';
import cors from 'cors';
import {registerHealthRoutes} from './routes/health.routes.js';
import {registerDecisionsRoutes} from './routes/decisions.routes.js';
import {registerArchitectureDecisionsRoutes} from './routes/architecture-decisions.routes.js';
import {createAppContainer} from './app/create-app-container.js';

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const container = createAppContainer();

    registerHealthRoutes(app);
    registerDecisionsRoutes(app, container.resolve('decisionsController'));
    registerArchitectureDecisionsRoutes(app, container.resolve('architectureDecisionsController'));

    return app;
}
