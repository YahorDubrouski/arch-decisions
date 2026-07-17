import type {Job} from 'bullmq';
import type {GenerateArchitectureDecisionService} from '@/services/architecture-decisions/generate-architecture-decision.service.js';
import type {GenerateArchitectureDecisionJobData} from '@/integrations/queue/architecture-jobs.queue.js';
import logger from '@/lib/logging/logger.js';

export function createGenerateArchitectureDecisionProcessor(
    generateArchitectureDecisionService: GenerateArchitectureDecisionService
) {
    return async function processGenerateArchitectureDecision(
        job: Job<GenerateArchitectureDecisionJobData>
    ): Promise<{architectureDecision: unknown}> {
        logger.info('Processing generate-architecture-decision job', {jobId: job.id});
        const architectureDecision = await generateArchitectureDecisionService.generate(
            job.data.context,
            job.data.recommendations
        );
        return {architectureDecision};
    };
}
