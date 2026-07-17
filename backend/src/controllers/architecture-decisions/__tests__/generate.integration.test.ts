/**
 * HTTP integration — POST /api/architecture-decisions/generate
 *
 * Business rules under test:
 * - Valid context + recommendations are accepted and return a job id.
 * - Invalid bodies are rejected before generation is enqueued.
 */
import type {Express} from 'express';
import request from 'supertest';

import {buildProjectContext} from '@/test/fixtures/project-context.fixture.js';
import {buildRecommendationsResponse} from '@/test/fixtures/recommendations-response.fixture.js';
import {createIntegrationApp} from '@/test/create-integration-app.js';

describe('POST /api/architecture-decisions/generate', () => {
    let app: Express;

    beforeAll(() => {
        app = createIntegrationApp();
    });

    /**
     * Given
     * - The generate payload has valid context and recommendations.
     * When
     * - A client requests ADR generation.
     * Then
     * - The API accepts the job and returns a jobId.
     */
    it('when generate payload is valid then accept job', async () => {
        // Arrange
        const payload = {
            context: buildProjectContext(),
            recommendations: buildRecommendationsResponse(),
        };

        // Act
        const response = await request(app)
            .post('/api/architecture-decisions/generate')
            .send(payload);

        // Assert
        expect(response.status).toBe(202);
        expect(typeof response.body.jobId).toBe('string');
        expect(response.body.jobId.length).toBeGreaterThan(0);
    });

    /**
     * Given
     * - The generate payload is missing required fields.
     * When
     * - A client requests ADR generation.
     * Then
     * - The API rejects the request as a bad request.
     */
    it('when generate payload is invalid then reject as bad request', async () => {
        // Arrange
        const invalidPayload = {context: buildProjectContext()};

        // Act
        const response = await request(app)
            .post('/api/architecture-decisions/generate')
            .send(invalidPayload);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});
