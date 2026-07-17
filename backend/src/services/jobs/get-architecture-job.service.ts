import {Job} from 'bullmq';
import {NotFoundError} from '@/lib/errors/app-error.js';
import {
    type ArchitectureJobData,
    getArchitectureJobsQueue,
} from '@/integrations/queue/architecture-jobs.queue.js';

export type ArchitectureJobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown';

export type ArchitectureJobStatusView = {
    jobId: string;
    type: string;
    status: ArchitectureJobStatus;
    result?: unknown;
    error?: string;
};

// BullMQ has several “not started yet” states; we collapse them to one API status.
// Example: "waiting-children" or "prioritized" → "waiting"; "completed" → "completed".
function mapBullmqState(state: string): ArchitectureJobStatus {
    switch (state) {
        case 'waiting':
        case 'waiting-children':
        case 'prioritized':
            return 'waiting';
        case 'active':
            return 'active';
        case 'completed':
            return 'completed';
        case 'failed':
            return 'failed';
        case 'delayed':
            return 'delayed';
        default:
            return 'unknown';
    }
}

export class GetArchitectureJobService {
    async getById(jobId: string): Promise<ArchitectureJobStatusView> {
        const queue = getArchitectureJobsQueue();
        const job: Job<ArchitectureJobData> | undefined = await queue.getJob(jobId);

        if (!job) {
            throw new NotFoundError('Job not found');
        }

        const state = await job.getState();
        const status = mapBullmqState(state);

        return {
            jobId,
            type: String(job.name),
            status,
            result: status === 'completed' ? job.returnvalue : undefined,
            error: status === 'failed' ? job.failedReason : undefined,
        };
    }
}
