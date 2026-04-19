// Types for AI decision provider (production and mock)

import type {ProjectContext} from '../../domain/context.js';
import type {DecisionResult} from '../../domain/DecisionCategory.js';

export interface DecisionsResponse {
    compute: DecisionResult;
    secrets: DecisionResult;
    cicd: DecisionResult;
}

/**
 * Abstraction for decision generation. Production uses OpenAI; tests use a mock.
 */
export interface IDecisionProvider {
    evaluateAll(context: ProjectContext): Promise<DecisionsResponse>;
}
