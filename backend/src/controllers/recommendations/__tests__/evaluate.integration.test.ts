/**
 * HTTP integration — POST /api/recommendations/evaluate
 *
 * Business rules under test:
 * - Valid project context is accepted and returns a job id.
 * - Invalid project context is rejected before evaluation is enqueued.
 */
import type {Express} from 'express';
import request from 'supertest';

import {buildProjectContext} from '@/test/fixtures/project-context.fixture.js';
import {createIntegrationApp} from '@/test/create-integration-app.js';

describe('POST /api/recommendations/evaluate', () => {
    let app: Express;

    beforeAll(() => {
        app = createIntegrationApp();
    });

    /**
     * Given
     * - The evaluate payload has a valid project context.
     * When
     * - A client requests recommendation evaluation.
     * Then
     * - The API accepts the job and returns a jobId.
     */
    it('when evaluate payload is valid then accept job', async () => {
        // Arrange
        const payload = {context: buildProjectContext()};

        // Act
        const response = await request(app).post('/api/recommendations/evaluate').send(payload);

        // Assert
        expect(response.status).toBe(202);
        expect(typeof response.body.jobId).toBe('string');
        expect(response.body.jobId.length).toBeGreaterThan(0);
    });

    /**
     * Given
     * - The evaluate payload has an invalid project context.
     * When
     * - A client requests recommendation evaluation.
     * Then
     * - The API rejects the request as a bad request.
     */
    it('when evaluate payload has invalid context then reject as bad request', async () => {
        // Arrange
        const invalidPayload = {context: {teamSize: 'nope'}};

        // Act
        const response = await request(app)
            .post('/api/recommendations/evaluate')
            .send(invalidPayload);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});
