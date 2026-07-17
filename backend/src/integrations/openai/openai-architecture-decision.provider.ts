import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import type {ProjectContext} from '@/domain/context.js';
import type {RecommendationsResponse} from '@/domain/RecommendationsResponse.js';
import {getOpenAIConfig} from '@/config/openai.config.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';
import {OpenAIGateway} from './openai-gateway.js';
import {openAIArchitectureDecisionResponseSchema} from './openai-architecture-decision-response.schema.js';

function buildPrompt(context: ProjectContext, recommendations: RecommendationsResponse): string {
    return `You are an expert software architect. Write an Architecture Decision Record in markdown.

Project context:
- Team size: ${context.teamSize}
- Traffic pattern: ${context.trafficPattern}
- Budget sensitivity: ${context.budgetSensitivity}
- Compliance: ${context.complianceRequirements.join(', ') || 'none'}
- Operational maturity: ${context.operationalMaturity}

Recommended options:
- Compute: ${recommendations.compute.recommended} (alternatives: ${recommendations.compute.alternatives.join(', ')})
- Secrets: ${recommendations.secrets.recommended} (alternatives: ${recommendations.secrets.alternatives.join(', ')})
- CI/CD: ${recommendations.cicd.recommended} (alternatives: ${recommendations.cicd.alternatives.join(', ')})

Respond with JSON only, no markdown fences, in this exact shape:
{
  "title": "short decision record title",
  "status": "proposed",
  "content": "full markdown with sections: Status, Context, Decision, Consequences, Alternatives Considered, Implementation Notes",
  "summary": "2-3 sentence executive summary"
}`;
}

export class OpenAIArchitectureDecisionProvider implements ArchitectureDecisionGenerator {
    constructor(private readonly openAIGateway = new OpenAIGateway()) {}

    async generate(
        context: ProjectContext,
        recommendations: RecommendationsResponse
    ): Promise<ArchitectureDecisionDraft> {
        const prompt = buildPrompt(context, recommendations);
        const {model} = getOpenAIConfig();

        const content = await this.openAIGateway.fetchCompletionContent('architecture-decision.generate', {
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
        const parsedDecision = openAIArchitectureDecisionResponseSchema.safeParse(parsedPayload);
        if (!parsedDecision.success) {
            throw new Error(
                `Invalid OpenAI architecture decision response shape: ${parsedDecision.error.message}`
            );
        }

        return parsedDecision.data;
    }
}
