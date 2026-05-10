// Domain: Business types and pure logic (no React dependencies)

export interface ProjectContext {
    teamSize: '1-5' | '6-20' | '21-50' | '50+';
    trafficPattern: 'low-steady' | 'variable' | 'high-spike' | 'unpredictable';
    budgetSensitivity: 'cost-optimized' | 'balanced' | 'performance-first';
    complianceRequirements: string[];
    operationalMaturity: 'minimal' | 'moderate' | 'advanced' | 'enterprise';
}

export function validateContext(context: Partial<ProjectContext>): boolean {
    // Business logic: validation rules (pure function, no side effects)
    return (
        context.teamSize !== undefined &&
        context.trafficPattern !== undefined &&
        context.budgetSensitivity !== undefined &&
        context.complianceRequirements !== undefined &&
        context.complianceRequirements.length > 0 &&
        context.operationalMaturity !== undefined
    );
}

export function isContextComplete(context: Partial<ProjectContext>): context is ProjectContext {
    return validateContext(context);
}
