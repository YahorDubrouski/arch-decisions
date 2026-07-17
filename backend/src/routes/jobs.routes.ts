import type {JobsController} from '@/controllers/jobs.controller.js';
import type {ApiRouter} from '@/lib/http/api-router.js';

export function registerJobsRoutes(api: ApiRouter, jobsController: JobsController): void {
    api.get('/api/jobs/:jobId', (request, response) => jobsController.get(request, response));
}
