import {Queue} from 'bullmq';
import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import {
    ARCHITECTURE_JOBS_QUEUE_NAME,
    architectureJobTypes,
    type ArchitectureJobType,
} from '@/integrations/queue/architecture-job.types.js';
import {createRedisConnection} from '@/integrations/queue/create-redis-connection.js';

export type EvaluateRecommendationsJobData = {
    type: typeof architectureJobTypes.evaluateRecommendations;
    context: ProjectContext;
};

export type GenerateArchitectureDecisionJobData = {
    type: typeof architectureJobTypes.generateArchitectureDecision;
    context: ProjectContext;
    recommendations: RecommendationsResponse;
};

export type ArchitectureJobData = EvaluateRecommendationsJobData | GenerateArchitectureDecisionJobData;

let architectureJobsQueue: Queue<ArchitectureJobData> | null = null;

export function getArchitectureJobsQueue(): Queue<ArchitectureJobData> {
    if (!architectureJobsQueue) {
        architectureJobsQueue = new Queue<ArchitectureJobData>(ARCHITECTURE_JOBS_QUEUE_NAME, {
            connection: createRedisConnection(),
            defaultJobOptions: {
                // Keep recent jobs for debugging; drop older ones.
                // Example: 101st completed job → oldest completed job is removed from Redis.
                removeOnComplete: 100,
                removeOnFail: 100,
                // Fail once — callers poll status; BullMQ should not auto-retry the same work.
                // Example: worker throws once → job status "failed" (no second attempt).
                attempts: 1,
            },
        });
    }

    return architectureJobsQueue;
}

export async function enqueueArchitectureJob(data: ArchitectureJobData): Promise<string> {
    const queue = getArchitectureJobsQueue();
    const job = await queue.add(data.type, data);
    if (!job.id) {
        throw new Error('Failed to enqueue architecture job: missing job id');
    }
    return job.id;
}

export type {ArchitectureJobType};
