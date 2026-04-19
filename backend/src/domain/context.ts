// Domain: Business entities and types (pure TypeScript, no framework dependencies)

export interface ProjectContext {
    teamSize: '1-5' | '6-20' | '21-50' | '50+';
    trafficPattern: 'low-steady' | 'variable' | 'high-spike' | 'unpredictable';
    budgetSensitivity: 'cost-optimized' | 'balanced' | 'performance-first';
    complianceRequirements: string[];
    operationalMaturity: 'minimal' | 'moderate' | 'advanced' | 'enterprise';
}

export function validateContext(context: unknown): context is ProjectContext {
    if (typeof context !== 'object' || context === null) {
        return false;
    }

    const ctx = context as Partial<ProjectContext>;

    return (
        ctx.teamSize !== undefined &&
        ['1-5', '6-20', '21-50', '50+'].includes(ctx.teamSize) &&
        ctx.trafficPattern !== undefined &&
        ['low-steady', 'variable', 'high-spike', 'unpredictable'].includes(ctx.trafficPattern) &&
        ctx.budgetSensitivity !== undefined &&
        ['cost-optimized', 'balanced', 'performance-first'].includes(ctx.budgetSensitivity) &&
        Array.isArray(ctx.complianceRequirements) &&
        ctx.operationalMaturity !== undefined &&
        ['minimal', 'moderate', 'advanced', 'enterprise'].includes(ctx.operationalMaturity)
    );
}
