import {DecisionCategory} from '@/domain/decisions';

const CATEGORY_LABELS: Record<DecisionCategory, string> = {
    compute: 'Compute',
    secrets: 'Secrets',
    cicd: 'CI/CD',
};

export function getDecisionCategoryLabel(category: DecisionCategory): string {
    return CATEGORY_LABELS[category];
}
