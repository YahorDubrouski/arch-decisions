export type ArchitectureDecisionGeneratorProvider = 'template' | 'openai';

export function getArchitectureDecisionGeneratorProvider(): ArchitectureDecisionGeneratorProvider {
    const configuredProvider = process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER?.toLowerCase();

    if (configuredProvider === undefined) {
        return 'template';
    }

    if (configuredProvider === 'template' || configuredProvider === 'openai') {
        return configuredProvider;
    }

    throw new Error(
        `Invalid ARCHITECTURE_DECISION_GENERATOR_PROVIDER: ${process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER}. Expected template or openai.`
    );
}
