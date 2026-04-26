import {z} from 'zod';

export const openAIDecisionsResponseSchema = z.object({
  compute: z.object({recommended: z.string(), alternatives: z.array(z.string())}),
  secrets: z.object({recommended: z.string(), alternatives: z.array(z.string())}),
  cicd: z.object({recommended: z.string(), alternatives: z.array(z.string())}),
});
