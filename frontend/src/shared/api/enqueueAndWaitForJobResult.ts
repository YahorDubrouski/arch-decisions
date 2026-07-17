import {z} from 'zod';
import {getJson, HttpClientError, postJson} from '@/shared/api/httpClient';

const enqueueJobResponseSchema = z.object({
    jobId: z.string().min(1),
});

const jobStatusSchema = z.object({
    job: z.object({
        jobId: z.string(),
        type: z.string(),
        status: z.enum(['waiting', 'active', 'completed', 'failed', 'delayed', 'unknown']),
        result: z.unknown().optional(),
        error: z.string().optional(),
    }),
});

// Ask about every 300ms, up to ~30s total, then give up with a timeout error.
// Example: 100 attempts × 300ms ≈ 30s max wait before "Timed out waiting for job result".
const POLL_INTERVAL_MS = 300;
const MAX_POLL_ATTEMPTS = 100;

// AbortSignal alone does not cancel a pending setTimeout, so we clear the timer when aborted.
// Example: sleep(300ms) starts → user cancels → timer cleared and AbortError thrown (no late resolve).
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            return;
        }

        const timeoutId = window.setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve();
        }, ms);

        function onAbort(): void {
            window.clearTimeout(timeoutId);
            reject(new DOMException('Aborted', 'AbortError'));
        }

        signal?.addEventListener('abort', onAbort, {once: true});
    });
}

/**
 * Starts a background job, then checks its status until it finishes, fails, or we time out.
 */
export async function enqueueAndWaitForJobResult<TResult>(
    path: string,
    body: unknown,
    resultSchema: z.ZodType<TResult>,
    signal?: AbortSignal
): Promise<TResult> {
    const enqueueResponse = await postJson(path, body, enqueueJobResponseSchema, {signal});

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        if (signal?.aborted) {
            throw new DOMException('Aborted', 'AbortError');
        }

        const statusResponse = await getJson(`/api/jobs/${enqueueResponse.jobId}`, jobStatusSchema, {
            signal,
        });

        if (!statusResponse) {
            throw new HttpClientError('Job not found', 404);
        }

        const {job} = statusResponse;

        if (job.status === 'completed') {
            return resultSchema.parse(job.result);
        }

        if (job.status === 'failed') {
            throw new HttpClientError(job.error ?? 'Job failed', 500);
        }

        await sleep(POLL_INTERVAL_MS, signal);
    }

    throw new HttpClientError('Timed out waiting for job result', 504);
}
