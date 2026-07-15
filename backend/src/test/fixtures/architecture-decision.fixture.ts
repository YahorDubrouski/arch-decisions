import type {ArchitectureDecision} from '@/domain/architecture-decision';

export function buildArchitectureDecision(overrides: Partial<ArchitectureDecision> = {}): ArchitectureDecision {
    return {
        id: 'decision-1',
        title: 'Cloud Architecture Decisions',
        status: 'proposed',
        content: '# Architecture Decision Record',
        summary: 'Summary text',
        createdAt: '2026-01-01T00:00:00.000Z',
        ...overrides,
    };
}
