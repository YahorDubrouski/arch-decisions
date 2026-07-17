import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationCategory} from '@/domain/RecommendationCategory.js';
import {calculateTradeOffs} from '@/domain/trade-off-calculator.js';
import {parseRecommendationsResponse} from '@/validators/schemas/RecommendationsResponseSchema.js';
import type {RecommendationProvider} from '@/services/recommendations/recommendation-provider.js';
import {getOpenAIConfig} from '@/config/openai.config.js';
import {OpenAIGateway} from './openai-gateway.js';
import {openAIRecommendationsResponseSchema} from './openai-recommendations-response.schema.js';
import type {OpenAIRecommendationsResponse} from './openai.types.js';

function buildPrompt(context: ProjectContext): string {
    return `You are an expert cloud architect. Given this project context, recommend one option per category and 2-3 alternatives.

Context:
- Team size: ${context.teamSize}
- Traffic pattern: ${context.trafficPattern}
- Budget sensitivity: ${context.budgetSensitivity}
- Compliance: ${context.complianceRequirements.join(', ') || 'none'}
- Operational maturity: ${context.operationalMaturity}

Respond with JSON only, no markdown, in this exact shape:
{
  "compute": { "recommended": "<one of: EC2, ECS, EKS, Lambda>", "alternatives": ["option2", "option3"] },
  "secrets": { "recommended": "<one of: AWS Parameter Store, AWS Secrets Manager, HashiCorp Vault, Environment Variables>", "alternatives": ["option2", "option3"] },
  "cicd": { "recommended": "<one of: GitHub Actions, GitLab CI, Jenkins, AWS CodePipeline>", "alternatives": ["option2", "option3"] }
}`;
}

function mapToRecommendation<T extends RecommendationCategory>(
    category: T,
    raw: {recommended: string; alternatives: string[]}
): RecommendationsResponse[T] {
    return {
        category,
        recommended: raw.recommended,
        alternatives: raw.alternatives,
        tradeOffs: calculateTradeOffs(category, raw.recommended),
    } as RecommendationsResponse[T];
}

export class OpenAIRecommendationsProvider implements RecommendationProvider {
    constructor(private readonly openAIGateway = new OpenAIGateway()) {}

    async evaluateAll(context: ProjectContext): Promise<RecommendationsResponse> {
        const prompt = buildPrompt(context);
        const {model} = getOpenAIConfig();

        const content = await this.openAIGateway.fetchCompletionContent('recommendations.evaluate', {
            model,
            messages: [
                {
                    role: 'system',
                    content: 'You respond only with valid JSON. No explanation, no markdown code fences.',
                },
                {role: 'user', content: prompt},
            ],
            temperature: 0.3,
        });

        const parsedPayload: unknown = JSON.parse(content);
        const parsedRaw = openAIRecommendationsResponseSchema.safeParse(parsedPayload);
        if (!parsedRaw.success) {
            throw new Error(
                `Invalid OpenAI response shape: ${parsedRaw.error.message}. Raw: ${content.slice(0, 200)}`
            );
        }

        const data: OpenAIRecommendationsResponse = parsedRaw.data;
        const mappedRecommendations: RecommendationsResponse = {
            compute: mapToRecommendation('compute', data.compute),
            secrets: mapToRecommendation('secrets', data.secrets),
            cicd: mapToRecommendation('cicd', data.cicd),
        };

        const parsedRecommendations = parseRecommendationsResponse(mappedRecommendations);
        if (!parsedRecommendations.ok) {
            throw new Error(
                `Mapped recommendations do not match internal contract: ${parsedRecommendations.errors.join('; ')}`
            );
        }

        return parsedRecommendations.data;
    }
}
