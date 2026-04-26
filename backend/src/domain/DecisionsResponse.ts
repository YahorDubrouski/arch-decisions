// Domain: Internal contract returned by all decision providers.

import type { DecisionResult } from './DecisionCategory.js';

export interface DecisionsResponse {
  compute: DecisionResult & { category: 'compute' };
  secrets: DecisionResult & { category: 'secrets' };
  cicd: DecisionResult & { category: 'cicd' };
}
