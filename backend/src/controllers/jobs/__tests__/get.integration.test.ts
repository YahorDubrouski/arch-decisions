/**
 * HTTP integration — GET /api/jobs/:jobId
 *
 * Business rules under test:
 * - A newly enqueued job can be polled by id.
 * - Unknown job ids are reported as not found.
 */
import type {Express} from 'express';
import request from 'supertest';

import {buildProjectContext} from '@/test/fixtures/project-context.fixture.js';
import {createIntegrationApp} from '@/test/create-integration-app.js';

describe('GET /api/jobs/:jobId', () => {
    let app: Express;

    beforeAll(() => {
        app = createIntegrationApp();
    });

    /**
     * Given
     * - A recommendations evaluation job was accepted.
     * When
     * - A client polls that job id.
     * Then
     * - The API returns job status for that id.
     */
    it('when client polls an enqueued job then return job status', async () => {
        // Arrange
        const enqueueResponse = await request(app)
            .post('/api/recommendations/evaluate')
            .send({context: buildProjectContext()});
        const jobId = enqueueResponse.body.jobId as string;

        // Act
        const response = await request(app).get(`/api/jobs/${jobId}`);

        // Assert
        expect(enqueueResponse.status).toBe(202);
        expect(response.status).toBe(200);
        expect(response.body.job).toMatchObject({
            jobId,
            status: expect.any(String),
            type: expect.any(String),
        });
    });

    /**
     * Given
     * - The requested job id does not exist.
     * When
     * - A client polls that job.
     * Then
     * - The API responds with not found.
     */
    it('when client polls an unknown job then respond not found', async () => {
        // Arrange
        const unknownJobId = '00000000-0000-4000-8000-000000000000';

        // Act
        const response = await request(app).get(`/api/jobs/${unknownJobId}`);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
    });
});
