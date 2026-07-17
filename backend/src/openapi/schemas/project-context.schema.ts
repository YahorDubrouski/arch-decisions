import {z} from '../zod.js';

export const ProjectContextSchema = z
    .object({
        teamSize: z.enum(['1-5', '6-20', '21-50', '50+']).openapi({
            description: 'Engineering team size band used for compute recommendations.',
            example: '1-5',
        }),
        trafficPattern: z
            .enum(['low-steady', 'variable', 'high-spike', 'unpredictable'])
            .openapi({
                description: 'Expected traffic shape for the workload.',
                example: 'low-steady',
            }),
        budgetSensitivity: z.enum(['cost-optimized', 'balanced', 'performance-first']).openapi({
            description: 'How strongly cost should outweigh performance.',
            example: 'cost-optimized',
        }),
        complianceRequirements: z.array(z.string()).openapi({
            description: 'Compliance regimes that affect secrets recommendations.',
            example: ['SOC2', 'HIPAA'],
        }),
        operationalMaturity: z.enum(['minimal', 'moderate', 'advanced', 'enterprise']).openapi({
            description: 'Ops maturity of the team running the platform.',
            example: 'minimal',
        }),
    })
    .openapi('ProjectContext');
