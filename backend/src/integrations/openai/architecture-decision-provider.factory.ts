import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';
import {getArchitectureDecisionGeneratorProvider} from '@/config/architecture-decision-generator.config.js';
import {getOpenAIConfig} from '@/config/openai.config.js';
import {TemplateArchitectureDecisionProvider} from './template-architecture-decision.provider.js';
import {OpenAIArchitectureDecisionProvider} from './openai-architecture-decision.provider.js';

export function createArchitectureDecisionGeneratorProvider(): ArchitectureDecisionGenerator {
    const configuredProvider = getArchitectureDecisionGeneratorProvider();

    if (configuredProvider === 'template') {
        return new TemplateArchitectureDecisionProvider();
    }

    const {apiKey} = getOpenAIConfig();
    if (!apiKey) {
        throw new Error(
            'ARCHITECTURE_DECISION_GENERATOR_PROVIDER is openai but OPENAI_API_KEY is not set.'
        );
    }

    return new OpenAIArchitectureDecisionProvider();
}
