// Domain: Business entities and types (pure TypeScript, no framework dependencies)

export interface ProjectContext {
    teamSize: '1-5' | '6-20' | '21-50' | '50+';
    trafficPattern: 'low-steady' | 'variable' | 'high-spike' | 'unpredictable';
    budgetSensitivity: 'cost-optimized' | 'balanced' | 'performance-first';
    complianceRequirements: string[];
    operationalMaturity: 'minimal' | 'moderate' | 'advanced' | 'enterprise';
}

export function validateContext(context: unknown): context is ProjectContext {
    return getContextValidationErrors(context).length === 0;
}

export function getContextValidationErrors(value: unknown): string[] {
    const errors: string[] = [];

    if (typeof value !== 'object' || value === null) {
        errors.push('Context must be an object');
        return errors;
    }

    const ctx = value as Partial<ProjectContext>;

    if (ctx.teamSize === undefined || !['1-5', '6-20', '21-50', '50+'].includes(ctx.teamSize)) {
        errors.push('teamSize is required and must be one of: 1-5, 6-20, 21-50, 50+');
    }
    if (
        ctx.trafficPattern === undefined ||
        !['low-steady', 'variable', 'high-spike', 'unpredictable'].includes(ctx.trafficPattern)
    ) {
        errors.push('trafficPattern is required and must be one of: low-steady, variable, high-spike, unpredictable');
    }
    if (
        ctx.budgetSensitivity === undefined ||
        !['cost-optimized', 'balanced', 'performance-first'].includes(ctx.budgetSensitivity)
    ) {
        errors.push('budgetSensitivity is required and must be one of: cost-optimized, balanced, performance-first');
    }
    if (!Array.isArray(ctx.complianceRequirements)) {
        errors.push('complianceRequirements must be an array');
    }
    if (
        ctx.operationalMaturity === undefined ||
        !['minimal', 'moderate', 'advanced', 'enterprise'].includes(ctx.operationalMaturity)
    ) {
        errors.push('operationalMaturity is required and must be one of: minimal, moderate, advanced, enterprise');
    }

    return errors;
}
