import type {ProjectContext} from '@/domain/context';

export function buildProjectContext(overrides: Partial<ProjectContext> = {}): ProjectContext {
    return {
        teamSize: '6-20',
        trafficPattern: 'variable',
        budgetSensitivity: 'balanced',
        complianceRequirements: ['SOC2'],
        operationalMaturity: 'moderate',
        ...overrides,
    };
}
