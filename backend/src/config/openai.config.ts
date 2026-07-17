export interface OpenAIConfig {
    apiKey?: string;
    model: string;
    timeoutMs: number;
    maxRetries: number;
}

export function getOpenAIConfig(): OpenAIConfig {
    const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS ?? '30000');
    const maxRetries = Number(process.env.OPENAI_MAX_RETRIES ?? '2');

    return {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 30_000,
        maxRetries: Number.isFinite(maxRetries) && maxRetries >= 0 ? maxRetries : 2,
    };
}
