import {
    architectureDecisionStatus,
    type ArchitectureDecision,
} from '@/domain/architecture-decision.js';

type SeedInput = {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
    context: {
        teamSize: string;
        trafficPattern: string;
        budgetSensitivity: string;
        complianceRequirements: string;
        operationalMaturity: string;
    };
    compute: string;
    computeAlternatives: string;
    secrets: string;
    secretsAlternatives: string;
    cicd: string;
    cicdAlternatives: string;
    consequences: string[];
    notes: string;
};

function buildSeed(input: SeedInput): ArchitectureDecision {
    return {
        id: input.id,
        title: input.title,
        status: architectureDecisionStatus,
        summary: input.summary,
        createdAt: input.createdAt,
        content: `# Architecture Decision Record

## Status
proposed

## Context
- Team size: ${input.context.teamSize}
- Traffic pattern: ${input.context.trafficPattern}
- Budget sensitivity: ${input.context.budgetSensitivity}
- Compliance requirements: ${input.context.complianceRequirements}
- Operational maturity: ${input.context.operationalMaturity}

## Decision
- **Compute:** ${input.compute}
  - Alternatives: ${input.computeAlternatives}
- **Secrets:** ${input.secrets}
  - Alternatives: ${input.secretsAlternatives}
- **CI/CD:** ${input.cicd}
  - Alternatives: ${input.cicdAlternatives}

## Consequences
${input.consequences.map((line) => `- ${line}`).join('\n')}

## Alternatives Considered
- Compute alternatives: ${input.computeAlternatives}
- Secrets alternatives: ${input.secretsAlternatives}
- CI/CD alternatives: ${input.cicdAlternatives}

## Implementation Notes
- ${input.notes}
`,
    };
}

/**
 * Demo documents for the Documents grid (≥15 so pagination is visible).
 * Fixed ids make seeds easy to spot in storage and tests.
 */
export const architectureDecisionSeeds: readonly ArchitectureDecision[] = [
    buildSeed({
        id: 'seed-startup-cost-optimized',
        title: 'Startup cost-optimized stack',
        summary:
            'Cost-first choices for a 1–5 person team: EC2, Parameter Store, and GitHub Actions under low steady traffic.',
        createdAt: '2026-01-10T10:00:00.000Z',
        context: {
            teamSize: '1-5',
            trafficPattern: 'low-steady',
            budgetSensitivity: 'cost-optimized',
            complianceRequirements: 'none',
            operationalMaturity: 'minimal',
        },
        compute: 'EC2',
        computeAlternatives: 'ECS, Lambda',
        secrets: 'AWS Parameter Store',
        secretsAlternatives: 'AWS Secrets Manager, Environment Variables',
        cicd: 'GitHub Actions',
        cicdAlternatives: 'GitLab CI, Jenkins',
        consequences: [
            'Fast to operate with a small team and a tight budget.',
            'Manual EC2 operations are acceptable while maturity is low.',
        ],
        notes: 'Revisit when traffic or compliance requirements grow.',
    }),
    buildSeed({
        id: 'seed-enterprise-compliance',
        title: 'Enterprise compliance platform',
        summary:
            'SOC2/HIPAA-oriented stack for a large team: ECS, Secrets Manager, and GitLab CI with balanced operational overhead.',
        createdAt: '2026-01-12T14:30:00.000Z',
        context: {
            teamSize: '50+',
            trafficPattern: 'variable',
            budgetSensitivity: 'performance-first',
            complianceRequirements: 'SOC2, HIPAA',
            operationalMaturity: 'enterprise',
        },
        compute: 'ECS',
        computeAlternatives: 'EKS, EC2',
        secrets: 'AWS Secrets Manager',
        secretsAlternatives: 'HashiCorp Vault, AWS Parameter Store',
        cicd: 'GitLab CI',
        cicdAlternatives: 'GitHub Actions, AWS CodePipeline',
        consequences: [
            'Stronger secrets controls and audit trails for regulated workloads.',
            'Managed containers keep ops load lower than a full Kubernetes platform.',
        ],
        notes: 'Validate controls against current cloud account standards before production.',
    }),
    buildSeed({
        id: 'seed-high-scale-eks',
        title: 'High-scale EKS delivery pipeline',
        summary:
            'Spike-tolerant platform for a growing product: EKS, HashiCorp Vault, and AWS CodePipeline for high-spike traffic.',
        createdAt: '2026-01-15T09:15:00.000Z',
        context: {
            teamSize: '21-50',
            trafficPattern: 'high-spike',
            budgetSensitivity: 'balanced',
            complianceRequirements: 'SOC2',
            operationalMaturity: 'advanced',
        },
        compute: 'EKS',
        computeAlternatives: 'ECS, EC2',
        secrets: 'HashiCorp Vault',
        secretsAlternatives: 'AWS Secrets Manager, AWS Parameter Store',
        cicd: 'AWS CodePipeline',
        cicdAlternatives: 'GitHub Actions, GitLab CI',
        consequences: [
            'Kubernetes supports rapid horizontal scale during spikes.',
            'Vault centralizes secrets for multi-account delivery.',
        ],
        notes: 'Invest in platform tooling before peak launch windows.',
    }),
    buildSeed({
        id: 'seed-serverless-mvp',
        title: 'Serverless MVP for small teams',
        summary:
            'Lambda-first MVP with Secrets Manager and GitHub Actions for a cost-sensitive team shipping quickly.',
        createdAt: '2026-01-18T16:45:00.000Z',
        context: {
            teamSize: '1-5',
            trafficPattern: 'variable',
            budgetSensitivity: 'cost-optimized',
            complianceRequirements: 'none',
            operationalMaturity: 'moderate',
        },
        compute: 'Lambda',
        computeAlternatives: 'ECS, EC2',
        secrets: 'AWS Secrets Manager',
        secretsAlternatives: 'AWS Parameter Store, Environment Variables',
        cicd: 'GitHub Actions',
        cicdAlternatives: 'GitLab CI, Jenkins',
        consequences: [
            'Minimal idle cost while validating product-market fit.',
            'Cold starts and packaging limits may push a later move to containers.',
        ],
        notes: 'Prefer Lambda when traffic is bursty and compute minutes stay low.',
    }),
    buildSeed({
        id: 'seed-multi-region-ecs',
        title: 'Multi-region ECS active-active',
        summary:
            'Active-active ECS across regions with Secrets Manager and CodePipeline for unpredictable global traffic.',
        createdAt: '2026-01-20T11:00:00.000Z',
        context: {
            teamSize: '21-50',
            trafficPattern: 'unpredictable',
            budgetSensitivity: 'performance-first',
            complianceRequirements: 'SOC2',
            operationalMaturity: 'advanced',
        },
        compute: 'ECS',
        computeAlternatives: 'EKS, EC2',
        secrets: 'AWS Secrets Manager',
        secretsAlternatives: 'HashiCorp Vault, AWS Parameter Store',
        cicd: 'AWS CodePipeline',
        cicdAlternatives: 'GitHub Actions, GitLab CI',
        consequences: [
            'Regional isolation improves blast radius control.',
            'Pipeline complexity rises with multi-account promotion paths.',
        ],
        notes: 'Define failover runbooks before enabling traffic shifting.',
    }),
    buildSeed({
        id: 'seed-fintech-vault',
        title: 'Fintech Vault hardening path',
        summary:
            'PCI-oriented secrets posture with Vault, ECS, and GitLab CI for a mid-size payments team.',
        createdAt: '2026-01-22T08:20:00.000Z',
        context: {
            teamSize: '6-20',
            trafficPattern: 'variable',
            budgetSensitivity: 'balanced',
            complianceRequirements: 'PCI-DSS',
            operationalMaturity: 'advanced',
        },
        compute: 'ECS',
        computeAlternatives: 'EKS, Lambda',
        secrets: 'HashiCorp Vault',
        secretsAlternatives: 'AWS Secrets Manager, AWS Parameter Store',
        cicd: 'GitLab CI',
        cicdAlternatives: 'GitHub Actions, Jenkins',
        consequences: [
            'Centralized secrets rotation supports audit evidence.',
            'Vault ops skill becomes a platform dependency.',
        ],
        notes: 'Separate production Vault from developer namespaces early.',
    }),
    buildSeed({
        id: 'seed-ecommerce-spike-lambda',
        title: 'Ecommerce flash-sale Lambda',
        summary:
            'Lambda + Parameter Store + GitHub Actions sized for high-spike flash sales on a lean ops budget.',
        createdAt: '2026-01-24T13:40:00.000Z',
        context: {
            teamSize: '6-20',
            trafficPattern: 'high-spike',
            budgetSensitivity: 'cost-optimized',
            complianceRequirements: 'none',
            operationalMaturity: 'moderate',
        },
        compute: 'Lambda',
        computeAlternatives: 'ECS, EC2',
        secrets: 'AWS Parameter Store',
        secretsAlternatives: 'AWS Secrets Manager, Environment Variables',
        cicd: 'GitHub Actions',
        cicdAlternatives: 'GitLab CI, AWS CodePipeline',
        consequences: [
            'Scales with campaign bursts without idle fleet cost.',
            'Concurrency limits need explicit load testing.',
        ],
        notes: 'Reserve provisioned concurrency for checkout paths only.',
    }),
    buildSeed({
        id: 'seed-media-cdn-ec2',
        title: 'Media encoding on EC2',
        summary:
            'Steady media encoding on EC2 with Secrets Manager and Jenkins for a content platform team.',
        createdAt: '2026-01-26T09:05:00.000Z',
        context: {
            teamSize: '6-20',
            trafficPattern: 'low-steady',
            budgetSensitivity: 'balanced',
            complianceRequirements: 'none',
            operationalMaturity: 'moderate',
        },
        compute: 'EC2',
        computeAlternatives: 'ECS, EKS',
        secrets: 'AWS Secrets Manager',
        secretsAlternatives: 'AWS Parameter Store, HashiCorp Vault',
        cicd: 'Jenkins',
        cicdAlternatives: 'GitHub Actions, GitLab CI',
        consequences: [
            'GPU/CPU shapes fit long-running encoding jobs.',
            'Instance patching remains an operations burden.',
        ],
        notes: 'Auto-scale warm pools around known encoding windows.',
    }),
    buildSeed({
        id: 'seed-healthcare-hipaa-ecs',
        title: 'Healthcare HIPAA ECS baseline',
        summary:
            'HIPAA-ready ECS with Secrets Manager and CodePipeline for clinical workflow services.',
        createdAt: '2026-01-28T15:10:00.000Z',
        context: {
            teamSize: '21-50',
            trafficPattern: 'variable',
            budgetSensitivity: 'performance-first',
            complianceRequirements: 'HIPAA',
            operationalMaturity: 'enterprise',
        },
        compute: 'ECS',
        computeAlternatives: 'EKS, EC2',
        secrets: 'AWS Secrets Manager',
        secretsAlternatives: 'HashiCorp Vault, AWS Parameter Store',
        cicd: 'AWS CodePipeline',
        cicdAlternatives: 'GitLab CI, GitHub Actions',
        consequences: [
            'Managed containers simplify BAA-covered operations.',
            'Pipeline gates enforce change evidence for audits.',
        ],
        notes: 'Encrypt logs and backups in the same compliance boundary.',
    }),
    buildSeed({
        id: 'seed-data-platform-eks',
        title: 'Analytics data platform on EKS',
        summary:
            'EKS + Vault + GitLab CI for a data platform team running unpredictable batch and serving workloads.',
        createdAt: '2026-01-30T12:00:00.000Z',
        context: {
            teamSize: '21-50',
            trafficPattern: 'unpredictable',
            budgetSensitivity: 'balanced',
            complianceRequirements: 'SOC2',
            operationalMaturity: 'advanced',
        },
        compute: 'EKS',
        computeAlternatives: 'ECS, EC2',
        secrets: 'HashiCorp Vault',
        secretsAlternatives: 'AWS Secrets Manager, AWS Parameter Store',
        cicd: 'GitLab CI',
        cicdAlternatives: 'GitHub Actions, AWS CodePipeline',
        consequences: [
            'Kubernetes scheduling fits mixed batch and online jobs.',
            'Cluster upgrades need dedicated platform capacity.',
        ],
        notes: 'Isolate noisy neighbors with dedicated node groups.',
    }),
    buildSeed({
        id: 'seed-mobile-backend-serverless',
        title: 'Mobile BFF serverless backend',
        summary:
            'Lambda BFF with Parameter Store and GitHub Actions for a small mobile product squad.',
        createdAt: '2026-02-01T10:30:00.000Z',
        context: {
            teamSize: '1-5',
            trafficPattern: 'variable',
            budgetSensitivity: 'cost-optimized',
            complianceRequirements: 'none',
            operationalMaturity: 'minimal',
        },
        compute: 'Lambda',
        computeAlternatives: 'ECS, EC2',
        secrets: 'AWS Parameter Store',
        secretsAlternatives: 'AWS Secrets Manager, Environment Variables',
        cicd: 'GitHub Actions',
        cicdAlternatives: 'GitLab CI, Jenkins',
        consequences: [
            'Low ops overhead for API aggregation.',
            'Payload size and timeout limits constrain heavy media paths.',
        ],
        notes: 'Keep auth token exchange off the hot path where possible.',
    }),
    buildSeed({
        id: 'seed-saas-gitlab-delivery',
        title: 'SaaS multi-tenant GitLab delivery',
        summary:
            'ECS multi-tenant SaaS with Secrets Manager and GitLab CI for balanced cost and release cadence.',
        createdAt: '2026-02-03T14:00:00.000Z',
        context: {
            teamSize: '6-20',
            trafficPattern: 'variable',
            budgetSensitivity: 'balanced',
            complianceRequirements: 'SOC2',
            operationalMaturity: 'moderate',
        },
        compute: 'ECS',
        computeAlternatives: 'EKS, Lambda',
        secrets: 'AWS Secrets Manager',
        secretsAlternatives: 'HashiCorp Vault, AWS Parameter Store',
        cicd: 'GitLab CI',
        cicdAlternatives: 'GitHub Actions, AWS CodePipeline',
        consequences: [
            'Tenant isolation maps cleanly to task definitions.',
            'Shared clusters need careful quota and noisy-neighbor controls.',
        ],
        notes: 'Promote via environment-scoped protected variables.',
    }),
    buildSeed({
        id: 'seed-edge-iot-lambda',
        title: 'Edge IoT ingest with Lambda',
        summary:
            'Event-driven Lambda ingest with Parameter Store and CodePipeline for unpredictable device traffic.',
        createdAt: '2026-02-05T07:45:00.000Z',
        context: {
            teamSize: '6-20',
            trafficPattern: 'unpredictable',
            budgetSensitivity: 'cost-optimized',
            complianceRequirements: 'none',
            operationalMaturity: 'moderate',
        },
        compute: 'Lambda',
        computeAlternatives: 'ECS, EC2',
        secrets: 'AWS Parameter Store',
        secretsAlternatives: 'AWS Secrets Manager, Environment Variables',
        cicd: 'AWS CodePipeline',
        cicdAlternatives: 'GitHub Actions, GitLab CI',
        consequences: [
            'Pay-per-invoke fits sparse device heartbeats.',
            'Backpressure design is required for firmware update storms.',
        ],
        notes: 'Use DLQs and replay tooling before production device fleets.',
    }),
    buildSeed({
        id: 'seed-batch-analytics-ec2',
        title: 'Nightly batch analytics on EC2',
        summary:
            'Scheduled EC2 batch with Parameter Store and Jenkins for low-steady overnight analytics.',
        createdAt: '2026-02-07T18:20:00.000Z',
        context: {
            teamSize: '6-20',
            trafficPattern: 'low-steady',
            budgetSensitivity: 'cost-optimized',
            complianceRequirements: 'none',
            operationalMaturity: 'minimal',
        },
        compute: 'EC2',
        computeAlternatives: 'ECS, Lambda',
        secrets: 'AWS Parameter Store',
        secretsAlternatives: 'AWS Secrets Manager, Environment Variables',
        cicd: 'Jenkins',
        cicdAlternatives: 'GitHub Actions, GitLab CI',
        consequences: [
            'Spot instances cut overnight compute spend.',
            'Job orchestration stays simpler than a full cluster.',
        ],
        notes: 'Shut down fleets automatically after batch completion windows.',
    }),
    buildSeed({
        id: 'seed-platform-codepipeline',
        title: 'Platform team CodePipeline golden path',
        summary:
            'Enterprise golden-path delivery: ECS, Vault, and CodePipeline for a platform engineering org.',
        createdAt: '2026-02-09T11:55:00.000Z',
        context: {
            teamSize: '50+',
            trafficPattern: 'variable',
            budgetSensitivity: 'performance-first',
            complianceRequirements: 'SOC2, PCI-DSS',
            operationalMaturity: 'enterprise',
        },
        compute: 'ECS',
        computeAlternatives: 'EKS, EC2',
        secrets: 'HashiCorp Vault',
        secretsAlternatives: 'AWS Secrets Manager, AWS Parameter Store',
        cicd: 'AWS CodePipeline',
        cicdAlternatives: 'GitLab CI, GitHub Actions',
        consequences: [
            'Standardized pipelines reduce product-team delivery variance.',
            'Central platform becomes a throughput bottleneck if understaffed.',
        ],
        notes: 'Publish paved-road templates before mandating migration.',
    }),
    buildSeed({
        id: 'seed-internal-tools-github',
        title: 'Internal tools on GitHub Actions',
        summary:
            'Internal tooling stack with ECS, Parameter Store, and GitHub Actions for a moderate maturity org.',
        createdAt: '2026-02-11T09:30:00.000Z',
        context: {
            teamSize: '21-50',
            trafficPattern: 'low-steady',
            budgetSensitivity: 'balanced',
            complianceRequirements: 'none',
            operationalMaturity: 'moderate',
        },
        compute: 'ECS',
        computeAlternatives: 'EC2, Lambda',
        secrets: 'AWS Parameter Store',
        secretsAlternatives: 'AWS Secrets Manager, Environment Variables',
        cicd: 'GitHub Actions',
        cicdAlternatives: 'GitLab CI, Jenkins',
        consequences: [
            'Developer familiarity speeds internal tool iteration.',
            'OIDC to cloud roles removes long-lived CI credentials.',
        ],
        notes: 'Separate internal tool accounts from customer-facing workloads.',
    }),
] as const;
