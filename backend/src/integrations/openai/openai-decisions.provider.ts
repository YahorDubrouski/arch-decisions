import type {DecisionsResponse} from '../../domain/DecisionsResponse.js';
import type {ProjectContext} from '../../domain/context.js';
import type {DecisionCategory} from '../../domain/DecisionCategory.js';
import {calculateTradeOffs} from '../../domain/trade-off-calculator.js';
import {parseDecisionsResponse} from '../../validators/schemas/DecisionsResponseSchema.js';
import type {DecisionProviderPort} from '../../services/decisions/decision-provider.port.js';
import {createOpenAIClient} from './openai.client.js';
import {getOpenAIConfig} from '../../config/openai.config.js';
import {openAIDecisionsResponseSchema} from './openai-decisions-response.schema.js';
import type {OpenAIDecisionsResponse} from './openai.types.js';

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

function toDecisionResult<T extends DecisionCategory>(
  category: T,
  raw: {recommended: string; alternatives: string[]}
): DecisionsResponse[T] {
  return {
    category,
    recommended: raw.recommended,
    alternatives: raw.alternatives,
    tradeOffs: calculateTradeOffs(category, raw.recommended),
  } as DecisionsResponse[T];
}

export class OpenAIDecisionsProvider implements DecisionProviderPort {
  async evaluateAll(context: ProjectContext): Promise<DecisionsResponse> {
    const client = createOpenAIClient();
    const prompt = buildPrompt(context);
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
    const parsedRaw = openAIDecisionsResponseSchema.safeParse(parsedPayload);
    if (!parsedRaw.success) {
      throw new Error(`Invalid OpenAI response shape: ${parsedRaw.error.message}. Raw: ${content.slice(0, 200)}`);
    }

    const data: OpenAIDecisionsResponse = parsedRaw.data;
    const mappedDecisions: DecisionsResponse = {
      compute: toDecisionResult('compute', data.compute),
      secrets: toDecisionResult('secrets', data.secrets),
      cicd: toDecisionResult('cicd', data.cicd),
    };

    const parsedDecisions = parseDecisionsResponse(mappedDecisions);
    if (!parsedDecisions.ok) {
      throw new Error(`Mapped decisions do not match internal contract: ${parsedDecisions.errors.join('; ')}`);
    }

    return parsedDecisions.data;
  }
}
