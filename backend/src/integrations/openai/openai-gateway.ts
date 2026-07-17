import OpenAI from 'openai';
import {getOpenAIConfig} from '@/config/openai.config.js';
import {UpstreamServiceError} from '@/lib/errors/app-error.js';
import logger from '@/lib/logging/logger.js';
import {createOpenAIClient} from './openai.client.js';

type CompletionRequest = {
    model: string;
    messages: OpenAI.Chat.ChatCompletionMessageParam[];
    temperature?: number;
};

/**
 * Encapsulates OpenAI SDK access: client config, retries, and chat completions.
 * Retries here are in addition to the SDK’s own retries (see createOpenAIClient).
 */
export class OpenAIGateway {
    private readonly client: OpenAI;
    private readonly maxRetries: number;

    constructor(client?: OpenAI, maxRetries?: number) {
        const config = getOpenAIConfig();
        this.client = client ?? createOpenAIClient();
        this.maxRetries = maxRetries ?? config.maxRetries;
    }

    async fetchCompletionContent(operationName: string, request: CompletionRequest): Promise<string> {
        const completion = await this.retry(operationName, () =>
            this.client.chat.completions.create({
                model: request.model,
                messages: request.messages,
                temperature: request.temperature,
                response_format: {type: 'json_object'},
            })
        );

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Empty response from OpenAI');
        }

        return content;
    }

    private async retry<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
        let attempt = 0;
        let lastError: unknown;

        while (attempt <= this.maxRetries) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                if (!isRetryableOpenAIError(error) || attempt === this.maxRetries) {
                    break;
                }

                // Wait longer after each failed try so a busy OpenAI service can recover.
                // Example: attempt 0 → wait 250ms; attempt 1 → wait 500ms; attempt 2 → wait 1000ms.
                const delayMs = 250 * 2 ** attempt;
                logger.warn('Retrying OpenAI operation after transient failure', {
                    operationName,
                    attempt: attempt + 1,
                    delayMs,
                    message: error instanceof Error ? error.message : String(error),
                });
                await new Promise((resolve) => setTimeout(resolve, delayMs));
                attempt += 1;
            }
        }

        throw new UpstreamServiceError(
            `OpenAI ${operationName} failed`,
            lastError instanceof Error ? lastError.message : String(lastError)
        );
    }
}

// Only retry transient failures — not bad prompts or other client mistakes.
// Example: status 429 or 503 → retry; status 400 → do not retry.
function isRetryableOpenAIError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const status = 'status' in error ? Number((error as {status?: number}).status) : undefined;
    if (status === 429 || (status !== undefined && status >= 500)) {
        return true;
    }

    const code = 'code' in error ? String((error as {code?: string}).code) : '';
    return code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'ENOTFOUND';
}
