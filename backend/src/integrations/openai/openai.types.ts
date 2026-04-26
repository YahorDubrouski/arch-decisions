import type {z} from 'zod';
import type {openAIDecisionsResponseSchema} from './openai-decisions-response.schema.js';

export type OpenAIDecisionsResponse = z.infer<typeof openAIDecisionsResponseSchema>;
