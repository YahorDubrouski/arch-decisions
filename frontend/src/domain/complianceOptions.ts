export const COMPLIANCE_OPTIONS = ['SOC2', 'HIPAA', 'PCI-DSS', 'GDPR', 'ISO27001'] as const;

export type ComplianceOption = (typeof COMPLIANCE_OPTIONS)[number];
