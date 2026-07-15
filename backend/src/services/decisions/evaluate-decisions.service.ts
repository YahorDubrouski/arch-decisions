import type {ProjectContext} from '@/domain/context.js';
import type {DecisionsResponse} from '@/domain/DecisionsResponse.js';
import type {DecisionProvider} from './decision-provider.js';

export class EvaluateDecisionsService {
  constructor(private readonly decisionProvider: DecisionProvider) {}

  async evaluateAll(context: ProjectContext): Promise<DecisionsResponse> {
    return this.decisionProvider.evaluateAll(context);
  }
}
