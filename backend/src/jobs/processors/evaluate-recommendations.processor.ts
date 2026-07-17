import type {Job} from 'bullmq';
import type {EvaluateRecommendationsService} from '@/services/recommendations/evaluate-recommendations.service.js';
import type {EvaluateRecommendationsJobData} from '@/integrations/queue/architecture-jobs.queue.js';
import logger from '@/lib/logging/logger.js';

export function createEvaluateRecommendationsProcessor(
    evaluateRecommendationsService: EvaluateRecommendationsService
) {
    return async function processEvaluateRecommendations(
        job: Job<EvaluateRecommendationsJobData>
    ): Promise<{recommendations: unknown}> {
        logger.info('Processing evaluate-recommendations job', {jobId: job.id});
        const recommendations = await evaluateRecommendationsService.evaluateAll(job.data.context);
        return {recommendations};
    };
}
