import {Worker, type Job} from 'bullmq';
import type {AppContainer} from '@/app/create-app-container.js';
import {ARCHITECTURE_JOBS_QUEUE_NAME, architectureJobTypes} from '@/integrations/queue/architecture-job.types.js';
import type {
    ArchitectureJobData,
    EvaluateRecommendationsJobData,
    GenerateArchitectureDecisionJobData,
} from '@/integrations/queue/architecture-jobs.queue.js';
import {createRedisConnection} from '@/integrations/queue/create-redis-connection.js';
import {createEvaluateRecommendationsProcessor} from '@/jobs/processors/evaluate-recommendations.processor.js';
import {createGenerateArchitectureDecisionProcessor} from '@/jobs/processors/generate-architecture-decision.processor.js';
import logger from '@/lib/logging/logger.js';

export function startArchitectureJobsWorker(container: AppContainer): Worker<ArchitectureJobData> {
    const evaluateProcessor = createEvaluateRecommendationsProcessor(
        container.resolve('evaluateRecommendationsService')
    );
    const generateProcessor = createGenerateArchitectureDecisionProcessor(
        container.resolve('generateArchitectureDecisionService')
    );

    const worker = new Worker<ArchitectureJobData>(
        ARCHITECTURE_JOBS_QUEUE_NAME,
        async (job: Job<ArchitectureJobData>) => {
            switch (job.data.type) {
                case architectureJobTypes.evaluateRecommendations:
                    return evaluateProcessor(job as Job<EvaluateRecommendationsJobData>);
                case architectureJobTypes.generateArchitectureDecision:
                    return generateProcessor(job as Job<GenerateArchitectureDecisionJobData>);
                default: {
                    const exhaustiveCheck: never = job.data;
                    throw new Error(`Unsupported job type: ${JSON.stringify(exhaustiveCheck)}`);
                }
            }
        },
        {
            connection: createRedisConnection(),
            concurrency: 2,
        }
    );

    worker.on('failed', (job, error) => {
        logger.error('Architecture job failed', {
            jobId: job?.id,
            name: job?.name,
            message: error.message,
        });
    });

    worker.on('completed', (job) => {
        logger.info('Architecture job completed', {jobId: job.id, name: job.name});
    });

    return worker;
}
