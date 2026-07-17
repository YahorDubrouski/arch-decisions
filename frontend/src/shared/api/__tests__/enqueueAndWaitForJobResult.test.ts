import {afterEach, describe, expect, it, vi} from 'vitest';
import {z} from 'zod';
import {enqueueAndWaitForJobResult} from '../enqueueAndWaitForJobResult';
import {HttpClientError} from '../httpClient';

const resultSchema = z.object({
    recommendations: z.object({
        value: z.string(),
    }),
});

describe('enqueueAndWaitForJobResult', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    /**
     * Given
     * - A job enqueue response and a completed job poll response.
     * When
     * - The client enqueues and waits for the job result.
     * Then
     * - The validated result is returned after two fetch calls.
     */
    it('enqueues a job and returns the completed result', async () => {
        // Arrange
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(
                new Response(JSON.stringify({jobId: 'job-1'}), {
                    status: 202,
                    headers: {'Content-Type': 'application/json'},
                })
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        job: {
                            jobId: 'job-1',
                            type: 'evaluate-recommendations',
                            status: 'completed',
                            result: {recommendations: {value: 'ok'}},
                        },
                    }),
                    {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            );

        vi.stubGlobal('fetch', fetchMock);

        // Act
        const result = await enqueueAndWaitForJobResult(
            '/api/recommendations/evaluate',
            {teamSize: '1-5'},
            resultSchema
        );

        // Assert
        expect(result).toEqual({recommendations: {value: 'ok'}});
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    /**
     * Given
     * - A job that completes with failed status.
     * When
     * - The client waits for the job result.
     * Then
     * - An HttpClientError is thrown.
     */
    it('throws when the job fails', async () => {
        // Arrange
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValueOnce(
                    new Response(JSON.stringify({jobId: 'job-2'}), {
                        status: 202,
                        headers: {'Content-Type': 'application/json'},
                    })
                )
                .mockResolvedValueOnce(
                    new Response(
                        JSON.stringify({
                            job: {
                                jobId: 'job-2',
                                type: 'evaluate-recommendations',
                                status: 'failed',
                                error: 'worker exploded',
                            },
                        }),
                        {
                            status: 200,
                            headers: {'Content-Type': 'application/json'},
                        }
                    )
                )
        );

        // Act & Assert
        await expect(
            enqueueAndWaitForJobResult('/api/recommendations/evaluate', {}, resultSchema)
        ).rejects.toBeInstanceOf(HttpClientError);
    });
});
