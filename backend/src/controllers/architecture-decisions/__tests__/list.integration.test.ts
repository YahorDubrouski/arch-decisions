/**
 * HTTP integration — GET /api/architecture-decisions
 *
 * Business rules under test:
 * - Demo architecture decisions are available to list.
 * - Search narrows the list to matching titles/summaries.
 */
import type {Express} from 'express';
import request from 'supertest';

import {createIntegrationApp} from '@/test/create-integration-app.js';

describe('GET /api/architecture-decisions', () => {
    let app: Express;

    beforeAll(() => {
        app = createIntegrationApp();
    });

    /**
     * Given
     * - Demo architecture decisions have been seeded.
     * When
     * - A client lists architecture decisions.
     * Then
     * - At least fifteen decisions are returned for the documents grid.
     */
    it('when client lists architecture decisions then return seeded documents', async () => {
        // Arrange
        // Act
        const response = await request(app).get('/api/architecture-decisions');

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.architectureDecisions)).toBe(true);
        expect(response.body.architectureDecisions.length).toBeGreaterThanOrEqual(15);
    });

    /**
     * Given
     * - Demo architecture decisions have been seeded.
     * When
     * - A client lists with a search term that matches a known seed title.
     * Then
     * - Only matching decisions are returned.
     */
    it('when client lists with matching search then return filtered documents', async () => {
        // Arrange
        const search = 'Startup cost-optimized';

        // Act
        const response = await request(app).get('/api/architecture-decisions').query({search});

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.architectureDecisions.length).toBeGreaterThanOrEqual(1);
        expect(
            response.body.architectureDecisions.every(
                (item: {title: string; summary: string}) =>
                    item.title.toLowerCase().includes(search.toLowerCase()) ||
                    item.summary.toLowerCase().includes(search.toLowerCase())
            )
        ).toBe(true);
    });
});
