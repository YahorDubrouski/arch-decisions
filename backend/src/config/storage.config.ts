export type ArchitectureDecisionStorageProvider = 'sqlite' | 'memory';

export function getArchitectureDecisionStorageProvider(): ArchitectureDecisionStorageProvider {
    const configuredProvider = process.env.STORAGE_PROVIDER?.toLowerCase();

    if (configuredProvider === 'memory') {
        return 'memory';
    }

    if (configuredProvider === 'sqlite') {
        return 'sqlite';
    }

    return 'sqlite';
}
