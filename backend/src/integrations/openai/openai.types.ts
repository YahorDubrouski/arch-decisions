import type {z} from 'zod';
import type {openAIRecommendationsResponseSchema} from './openai-recommendations-response.schema.js';

export type OpenAIRecommendationsResponse = z.infer<typeof openAIRecommendationsResponseSchema>;
