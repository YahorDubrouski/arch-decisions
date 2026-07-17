import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {registerHealthRoutes} from './routes/health.routes.js';
import {registerRecommendationsRoutes} from './routes/recommendations.routes.js';
import {registerArchitectureDecisionsRoutes} from './routes/architecture-decisions.routes.js';
import {registerJobsRoutes} from './routes/jobs.routes.js';
import {registerSwaggerRoutes} from './routes/swagger.routes.js';
import {createAppContainer} from './app/create-app-container.js';
import {seedArchitectureDecisionsIfEmpty} from './integrations/storage/seed/seed-architecture-decisions-if-empty.js';
import {createApiRouter} from './lib/http/api-router.js';
import {correlationIdMiddleware} from './middleware/correlation-id.middleware.js';
import {apiRateLimiter} from './middleware/rate-limit.middleware.js';
import {errorHandlerMiddleware} from './middleware/error-handler.middleware.js';

export function createApp() {
    const app = express();

    // Relax CSP enough for Swagger UI scripts/styles while keeping other Helmet defaults.
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
                    connectSrc: ["'self'"],
                },
            },
        })
    );
    app.use(cors());
    app.use(correlationIdMiddleware);
    // Cap body size so oversized payloads cannot fill memory.
    // Example: 50kb JSON → accepted; 200kb JSON → 413 / rejected by Express.
    app.use(express.json({limit: '100kb'}));
    app.use('/api', apiRateLimiter);

    const container = createAppContainer();
    seedArchitectureDecisionsIfEmpty(container.resolve('architectureDecisionRepository'));

    registerSwaggerRoutes(app);
    registerHealthRoutes(app);

    const api = createApiRouter(app);
    registerRecommendationsRoutes(api, container.resolve('recommendationsController'));
    registerArchitectureDecisionsRoutes(api, container.resolve('architectureDecisionsController'));
    registerJobsRoutes(api, container.resolve('jobsController'));

    app.use(errorHandlerMiddleware);

    return app;
}
