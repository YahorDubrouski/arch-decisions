import type {Express} from 'express';
import swaggerUi from 'swagger-ui-express';

import {buildOpenApiDocument} from '@/openapi/document.js';

export function registerSwaggerRoutes(app: Express): void {
    const openApiDocument = buildOpenApiDocument();

    app.get('/openapi.json', (_request, response) => {
        response.json(openApiDocument);
    });

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(openApiDocument, {
            customSiteTitle: 'Architecture Decisions API (Express)',
        })
    );
}
