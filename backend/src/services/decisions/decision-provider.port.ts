import type {ProjectContext} from '../../domain/context.js';
import type {DecisionsResponse} from '../../domain/DecisionsResponse.js';

export interface DecisionProviderPort {
  evaluateAll(context: ProjectContext): Promise<DecisionsResponse>;
}
