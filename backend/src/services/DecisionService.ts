// Service: Orchestrates decision generation via AI provider (or mock in tests)

import type {ProjectContext} from '../domain/context.js';
import type {DecisionsResponse, IDecisionProvider} from './ai/types.js';

// Re-export for controllers and tests
export type {DecisionResult} from '../domain/DecisionCategory.js';

export class DecisionService {
    constructor(private readonly provider: IDecisionProvider) {
    }

    /**
     * Evaluates all three categories (compute, secrets, cicd) via the configured provider (OpenAI in production, mock in tests).
     */
    async evaluateAll(context: ProjectContext): Promise<DecisionsResponse> {
        return this.provider.evaluateAll(context);
    }
}
