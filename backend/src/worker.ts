import {createAppContainer} from '@/app/create-app-container.js';
import {startArchitectureJobsWorker} from '@/jobs/start-architecture-jobs-worker.js';
import logger from '@/lib/logging/logger.js';

/**
 * Worker assumes the API process already ran SQLite migrations.
 * It opens the shared DB for job side effects (e.g. persisting ADRs).
 */
async function startWorker(): Promise<void> {
    const container = createAppContainer();
    const worker = startArchitectureJobsWorker(container);

    const shutdown = async (signal: string): Promise<void> => {
        logger.info('Shutting down architecture jobs worker', {signal});
        await worker.close();
        process.exit(0);
    };

    process.on('SIGTERM', () => {
        void shutdown('SIGTERM');
    });
    process.on('SIGINT', () => {
        void shutdown('SIGINT');
    });

    logger.info('Architecture jobs worker started');
}

void startWorker();
