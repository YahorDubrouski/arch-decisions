import {RecommendationCategory} from '@/domain/recommendations';

const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
    compute: 'Compute',
    secrets: 'Secrets',
    cicd: 'CI/CD',
};

export function getRecommendationCategoryLabel(category: RecommendationCategory): string {
    return CATEGORY_LABELS[category];
}
