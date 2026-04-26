import type {ProjectContext} from '../../domain/context.js';
import type {DecisionsResponse} from '../../domain/DecisionsResponse.js';
import type {DecisionProviderPort} from './decision-provider.port.js';

export class EvaluateDecisionsService {
  constructor(private readonly decisionProvider: DecisionProviderPort) {}

  async evaluateAll(context: ProjectContext): Promise<DecisionsResponse> {
    return this.decisionProvider.evaluateAll(context);
  }
}
