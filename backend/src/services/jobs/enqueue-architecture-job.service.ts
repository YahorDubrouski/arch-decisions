import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import {architectureJobTypes} from '@/integrations/queue/architecture-job.types.js';
import {enqueueArchitectureJob} from '@/integrations/queue/architecture-jobs.queue.js';

export class EnqueueArchitectureJobService {
    async enqueueEvaluateRecommendations(context: ProjectContext): Promise<string> {
        return enqueueArchitectureJob({
            type: architectureJobTypes.evaluateRecommendations,
            context,
        });
    }

    async enqueueGenerateArchitectureDecision(
        context: ProjectContext,
        recommendations: RecommendationsResponse
    ): Promise<string> {
        return enqueueArchitectureJob({
            type: architectureJobTypes.generateArchitectureDecision,
            context,
            recommendations,
        });
    }
}
