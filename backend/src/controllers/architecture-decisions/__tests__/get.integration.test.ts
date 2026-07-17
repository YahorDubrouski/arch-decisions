/**
 * HTTP integration — GET /api/architecture-decisions/:decisionId
 *
 * Business rules under test:
 * - Demo architecture decisions are available to open by id.
 * - Unknown decision ids are reported as not found.
 */
import type {Express} from 'express';
import request from 'supertest';

import {createIntegrationApp} from '@/test/create-integration-app.js';

describe('GET /api/architecture-decisions/:decisionId', () => {
    let app: Express;

    beforeAll(() => {
        app = createIntegrationApp();
    });

    /**
     * Given
     * - A known seed decision id exists (startup cost-optimized).
     * When
     * - A client opens that architecture decision.
     * Then
     * - The proposed ADR document content is returned.
     */
    it('when client opens a known seed decision then return the proposed ADR', async () => {
        // Arrange
        const decisionId = 'seed-startup-cost-optimized';

        // Act
        const response = await request(app).get(`/api/architecture-decisions/${decisionId}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.architectureDecision).toMatchObject({
            id: decisionId,
            status: 'proposed',
        });
        expect(response.body.architectureDecision.content).toContain('Architecture Decision Record');
    });

    /**
     * Given
     * - The requested architecture decision id does not exist.
     * When
     * - A client opens that architecture decision.
     * Then
     * - The API responds with not found.
     */
    it('when client opens an unknown decision then respond not found', async () => {
        // Arrange
        const unknownDecisionId = 'does-not-exist';

        // Act
        const response = await request(app).get(
            `/api/architecture-decisions/${unknownDecisionId}`
        );

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
    });
});
