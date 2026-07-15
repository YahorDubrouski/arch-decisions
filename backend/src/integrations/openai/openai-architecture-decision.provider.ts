import type {ArchitectureDecisionDraft} from '@/domain/architecture-decision.js';
import type {ProjectContext} from '@/domain/context.js';
import type {DecisionsResponse} from '@/domain/DecisionsResponse.js';
import {getOpenAIConfig} from '@/config/openai.config.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';
import {createOpenAIClient} from './openai.client.js';
import {openAIArchitectureDecisionResponseSchema} from './openai-architecture-decision-response.schema.js';

function buildPrompt(context: ProjectContext, decisions: DecisionsResponse): string {
    return `You are an expert software architect. Write an Architecture Decision Record in markdown.

Project context:
- Team size: ${context.teamSize}
- Traffic pattern: ${context.trafficPattern}
- Budget sensitivity: ${context.budgetSensitivity}
- Compliance: ${context.complianceRequirements.join(', ') || 'none'}
- Operational maturity: ${context.operationalMaturity}

Recommended decisions:
- Compute: ${decisions.compute.recommended} (alternatives: ${decisions.compute.alternatives.join(', ')})
- Secrets: ${decisions.secrets.recommended} (alternatives: ${decisions.secrets.alternatives.join(', ')})
- CI/CD: ${decisions.cicd.recommended} (alternatives: ${decisions.cicd.alternatives.join(', ')})

Respond with JSON only, no markdown fences, in this exact shape:
{
  "title": "short decision record title",
  "status": "proposed",
  "content": "full markdown with sections: Status, Context, Decision, Consequences, Alternatives Considered, Implementation Notes",
  "summary": "2-3 sentence executive summary"
}`;
}

export class OpenAIArchitectureDecisionProvider implements ArchitectureDecisionGenerator {
    async generate(context: ProjectContext, decisions: DecisionsResponse): Promise<ArchitectureDecisionDraft> {
        const client = createOpenAIClient();
        const prompt = buildPrompt(context, decisions);
        const {model} = getOpenAIConfig();

        const completion = await client.chat.completions.create({
            model,
            messages: [
                {role: 'system', content: 'You respond only with valid JSON. No explanation, no markdown code fences.'},
                {role: 'user', content: prompt},
            ],
            response_format: {type: 'json_object'},
            temperature: 0.3,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Empty response from OpenAI');
        }

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
