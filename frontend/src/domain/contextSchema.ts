import {z} from 'zod';

export const teamSizeSchema = z.enum(['1-5', '6-20', '21-50', '50+']);

export const trafficPatternSchema = z.enum([
    'low-steady',
    'variable',
    'high-spike',
    'unpredictable',
]);

export const budgetSensitivitySchema = z.enum([
    'cost-optimized',
    'balanced',
    'performance-first',
]);

export const operationalMaturitySchema = z.enum([
    'minimal',
    'moderate',
    'advanced',
    'enterprise',
]);

export const projectContextSchema = z.object({
    teamSize: teamSizeSchema,
    trafficPattern: trafficPatternSchema,
    budgetSensitivity: budgetSensitivitySchema,
    complianceRequirements: z.array(z.string()).min(1),
    operationalMaturity: operationalMaturitySchema,
});

export type ProjectContext = z.infer<typeof projectContextSchema>;

const STEP_FIELD_MESSAGES: Record<number, {field: keyof ProjectContext; message: string}> = {
    1: {field: 'teamSize', message: 'Please select team size'},
    2: {field: 'trafficPattern', message: 'Please select traffic pattern'},
    3: {field: 'budgetSensitivity', message: 'Please select budget sensitivity'},
    4: {field: 'complianceRequirements', message: 'Please select at least one compliance requirement'},
    5: {field: 'operationalMaturity', message: 'Please select operational maturity'},
};

export function validateStep(
    step: number,
    context: Partial<ProjectContext>
): Record<string, string> {
    const stepField = STEP_FIELD_MESSAGES[step];
    if (!stepField) {
        return {};
    }

    const value = context[stepField.field];
    const isMissing =
        value === undefined ||
        (Array.isArray(value) && value.length === 0);

    if (isMissing) {
        return {[stepField.field]: stepField.message};
    }

    return {};
}

export function isStepValid(step: number, context: Partial<ProjectContext>): boolean {
    return Object.keys(validateStep(step, context)).length === 0;
}

export function isContextComplete(context: Partial<ProjectContext>): context is ProjectContext {
    return projectContextSchema.safeParse(context).success;
}
