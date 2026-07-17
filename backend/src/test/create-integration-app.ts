process.env.STORAGE_PROVIDER = 'memory';
process.env.RECOMMENDATION_PROVIDER = 'mock';
process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER = 'template';

import type {Express} from 'express';

import {createApp} from '@/app.js';

/**
 * Boots the Express app for HTTP integration tests (in-memory storage, mock providers).
 */
export function createIntegrationApp(): Express {
    return createApp();
}
