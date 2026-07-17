// Domain: Internal contract returned by all decision providers.

import type { RecommendationResult } from './RecommendationCategory.js';

export interface RecommendationsResponse {
  compute: RecommendationResult & { category: 'compute' };
  secrets: RecommendationResult & { category: 'secrets' };
  cicd: RecommendationResult & { category: 'cicd' };
}
