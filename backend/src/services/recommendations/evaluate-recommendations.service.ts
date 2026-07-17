import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import type {RecommendationProvider} from './recommendation-provider.js';

export class EvaluateRecommendationsService {
  constructor(private readonly recommendationProvider: RecommendationProvider) {}

  async evaluateAll(context: ProjectContext): Promise<RecommendationsResponse> {
    return this.recommendationProvider.evaluateAll(context);
  }
}
