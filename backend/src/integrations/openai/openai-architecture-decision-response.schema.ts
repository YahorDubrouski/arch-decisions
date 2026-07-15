import {z} from 'zod';
import {architectureDecisionDraftSchema} from '@/validators/schemas/ArchitectureDecisionSchema.js';

export const openAIArchitectureDecisionResponseSchema = architectureDecisionDraftSchema;

export type OpenAIArchitectureDecisionResponse = z.infer<typeof openAIArchitectureDecisionResponseSchema>;
