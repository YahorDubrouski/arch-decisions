import {describe, expect, it, jest} from '@jest/globals';
import type OpenAI from 'openai';
import {UpstreamServiceError} from '@/lib/errors/app-error';
import {OpenAIGateway} from '@/integrations/openai/openai-gateway';

function createGatewayWithClient(create: unknown, maxRetries = 2): OpenAIGateway {
    const client = {
        chat: {
            completions: {
                create,
            },
        },
    } as unknown as OpenAI;

    return new OpenAIGateway(client, maxRetries);
}

describe('OpenAIGateway', () => {
    /**
     * Given
     * - OpenAI returns JSON completion content.
     * When
     * - A completion is fetched.
     * Then
     * - The content is returned and JSON response format is requested.
     */
    it('when completion succeeds then return JSON content', async () => {
        // Arrange
        const create = jest.fn(async () => ({
            choices: [{message: {content: '{"ok":true}'}}],
        }));
        const gateway = createGatewayWithClient(create);

        // Act
        const content = await gateway.fetchCompletionContent('test', {
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: 'hi'}],
        });

        // Assert
        expect(content).toBe('{"ok":true}');
        expect(create).toHaveBeenCalledWith(
            expect.objectContaining({
                response_format: {type: 'json_object'},
            })
        );
    });

    /**
     * Given
     * - OpenAI fails with a retryable error once then succeeds.
     * When
     * - A completion is fetched.
     * Then
     * - The gateway retries and returns recovered content.
     */
    it('when retryable failure occurs then retry and succeed', async () => {
        // Arrange
        let attempts = 0;
        const create = jest.fn(async () => {
            attempts += 1;
            if (attempts < 2) {
                const error = new Error('rate limited') as Error & {status: number};
                error.status = 429;
                throw error;
            }
            return {choices: [{message: {content: '{"recovered":true}'}}]};
        });
        const gateway = createGatewayWithClient(create, 2);

        // Act
        const content = await gateway.fetchCompletionContent('test', {
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: 'hi'}],
        });

        // Assert
        expect(content).toBe('{"recovered":true}');
        expect(attempts).toBe(2);
    });

    /**
     * Given
     * - OpenAI keeps failing with retryable errors beyond the retry limit.
     * When
     * - A completion is fetched.
     * Then
     * - An UpstreamServiceError is thrown.
     */
    it('when retries are exhausted then throw UpstreamServiceError', async () => {
        // Arrange
        const create = jest.fn(async () => {
            const error = new Error('server') as Error & {status: number};
            error.status = 503;
            throw error;
        });
        const gateway = createGatewayWithClient(create, 1);

        // Act & Assert
        await expect(
            gateway.fetchCompletionContent('test', {
                model: 'gpt-4o-mini',
                messages: [{role: 'user', content: 'hi'}],
            })
        ).rejects.toBeInstanceOf(UpstreamServiceError);
    });

    /**
     * Given
     * - OpenAI returns a non-retryable client error.
     * When
     * - A completion is fetched.
     * Then
     * - The gateway fails immediately without retrying.
     */
    it('when error is non-retryable then fail without retrying', async () => {
        // Arrange
        const create = jest.fn(async () => {
            const error = new Error('bad request') as Error & {status: number};
            error.status = 400;
            throw error;
        });
        const gateway = createGatewayWithClient(create, 3);

        // Act & Assert
        await expect(
            gateway.fetchCompletionContent('test', {
                model: 'gpt-4o-mini',
                messages: [{role: 'user', content: 'hi'}],
            })
        ).rejects.toBeInstanceOf(UpstreamServiceError);
        expect(create).toHaveBeenCalledTimes(1);
    });

    /**
     * Given
     * - OpenAI returns empty completion content.
     * When
     * - A completion is fetched.
     * Then
     * - An empty response error is thrown.
     */
    it('when completion content is empty then reject', async () => {
        // Arrange
        const create = jest.fn(async () => ({
            choices: [{message: {content: ''}}],
        }));
        const gateway = createGatewayWithClient(create);

        // Act & Assert
        await expect(
            gateway.fetchCompletionContent('test', {
                model: 'gpt-4o-mini',
                messages: [{role: 'user', content: 'hi'}],
            })
        ).rejects.toThrow('Empty response from OpenAI');
    });
});
