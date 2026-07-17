/**
 * HTTP integration — GET /health
 *
 * Business rules under test:
 * - The API exposes a health check for liveness.
 */
import type {Express} from 'express';
import request from 'supertest';

import {createIntegrationApp} from '@/test/create-integration-app.js';

describe('GET /health', () => {
    let app: Express;

    beforeAll(() => {
        app = createIntegrationApp();
    });

    /**
     * Given
     * - The API is running.
     * When
     * - A client checks service health.
     * Then
     * - The API reports status ok with a service message.
     */
    it('when client checks health then report status ok', async () => {
        // Arrange
        // Act
        const response = await request(app).get('/health');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            message: expect.any(String),
        });
        expect(response.body.message.length).toBeGreaterThan(0);
    });
});
