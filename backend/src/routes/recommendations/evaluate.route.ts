import type {RecommendationsController} from '@/controllers/recommendations.controller.js';
import type {ApiRouter} from '@/lib/http/api-router.js';

export function registerEvaluateRoute(
    api: ApiRouter,
    recommendationsController: RecommendationsController
): void {
    api.post('/api/recommendations/evaluate', (request, response) =>
        recommendationsController.post(request, response)
    );
}
