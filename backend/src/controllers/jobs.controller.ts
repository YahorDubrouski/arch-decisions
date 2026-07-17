import type {Request, Response} from 'express';
import {readPathParam} from '@/lib/http/read-path-param.js';
import type {GetArchitectureJobService} from '@/services/jobs/get-architecture-job.service.js';

export class JobsController {
    constructor(private readonly getArchitectureJobService: GetArchitectureJobService) {}

    async get(request: Request, response: Response): Promise<void> {
        const jobId = readPathParam(request.params.jobId, 'Job id');

        const job = await this.getArchitectureJobService.getById(jobId);
        response.status(200).json({job});
    }
}
