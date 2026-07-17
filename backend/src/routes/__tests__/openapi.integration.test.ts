/**
 * HTTP integration — GET /openapi.json
 *
 * Business rules under test:
 * - OpenAPI documents the public HTTP contract clients rely on.
 */
import type {Express} from 'express';
import request from 'supertest';

import {createIntegrationApp} from '@/test/create-integration-app.js';

describe('GET /openapi.json', () => {
    let app: Express;

    beforeAll(() => {
        app = createIntegrationApp();
    });

    /**
     * Given
     * - OpenAPI is generated from Zod schemas and per-endpoint *.openapi.ts files.
     * When
     * - A client fetches the OpenAPI document.
     * Then
     * - The document names the API and lists the public routes.
     */
    it('when client fetches openapi then return generated API contract', async () => {
        // Arrange
        // Act
        const response = await request(app).get('/openapi.json');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.info.title).toBe('Architecture Decisions API');
        expect(response.body.paths['/health']).toBeDefined();
        expect(response.body.paths['/api/recommendations/evaluate']).toBeDefined();
        expect(response.body.paths['/api/architecture-decisions']).toBeDefined();
        expect(response.body.paths['/api/architecture-decisions/generate']).toBeDefined();
        expect(response.body.paths['/api/architecture-decisions/{decisionId}']).toBeDefined();
        expect(response.body.paths['/api/jobs/{jobId}']).toBeDefined();
    });
});
