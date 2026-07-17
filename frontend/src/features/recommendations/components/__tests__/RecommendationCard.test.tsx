import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {RecommendationResult} from '@/domain/recommendations';
import {RecommendationCard} from '../RecommendationCard';

const sampleRecommendation: RecommendationResult = {
    category: 'compute',
    recommended: 'ECS',
    alternatives: ['EC2', 'Lambda'],
    tradeOffs: {
        cost: 'medium',
        complexity: 'medium',
        risk: 'low',
        operationalOverhead: 'medium',
    },
};

describe('RecommendationCard', () => {
    it('renders category title and recommended option', () => {
        // Arrange
        // (sample compute recommendation)

        // Act
        render(<RecommendationCard recommendation={sampleRecommendation}/>);

        // Assert
        expect(screen.getByRole('heading', {name: 'Compute'})).toBeInTheDocument();
        expect(screen.getByText('ECS')).toBeInTheDocument();
    });

    /**
     * Given
     * - A compute recommendation with alternatives and trade-offs.
     * When
     * - The card is rendered.
     * Then
     * - Details are expanded by default and show alternatives and trade-offs.
     */
    it('renders alternatives and trade-offs when expanded by default', () => {
        // Arrange
        // (sample compute recommendation)

        // Act
        render(<RecommendationCard recommendation={sampleRecommendation}/>);

        // Assert
        expect(screen.getByRole('button', {name: /hide compute details/i})).toHaveAttribute(
            'aria-expanded',
            'true'
        );
        expect(screen.getByText('EC2')).toBeInTheDocument();
        expect(screen.getByText('Lambda')).toBeInTheDocument();
        expect(screen.getByText('Cost')).toBeInTheDocument();
        expect(screen.getByText('Complexity')).toBeInTheDocument();
        expect(screen.getByText('Risk')).toBeInTheDocument();
        expect(screen.getByText('Ops overhead')).toBeInTheDocument();
        expect(screen.getAllByText('medium').length).toBeGreaterThan(0);
        expect(screen.getByText('low')).toBeInTheDocument();
    });

    /**
     * Given
     * - A recommendation card with expanded details.
     * When
     * - The user toggles details twice.
     * Then
     * - Details collapse on first toggle and expand again on second toggle.
     */
    it('collapses and expands details on toggle', async () => {
        // Arrange
        const user = userEvent.setup();

        // Act
        render(<RecommendationCard recommendation={sampleRecommendation}/>);
        await user.click(screen.getByRole('button', {name: /hide compute details/i}));

        // Assert
        expect(screen.getByRole('button', {name: /show compute details/i})).toHaveAttribute(
            'aria-expanded',
            'false'
        );
        expect(screen.getByText('EC2')).not.toBeVisible();
        expect(screen.getByText('Cost')).not.toBeVisible();
        expect(screen.getByText('ECS')).toBeVisible();

        // Act
        await user.click(screen.getByRole('button', {name: /show compute details/i}));

        // Assert
        expect(screen.getByRole('button', {name: /hide compute details/i})).toHaveAttribute(
            'aria-expanded',
            'true'
        );
        expect(screen.getByText('EC2')).toBeVisible();
        expect(screen.getByText('Cost')).toBeVisible();
    });

    /**
     * Given
     * - A recommendation with no alternatives.
     * When
     * - The card is rendered.
     * Then
     * - A message explains that no alternatives were provided.
     */
    it('shows message when alternatives are empty', () => {
        // Arrange
        const recommendationWithoutAlternatives = {
            ...sampleRecommendation,
            alternatives: [],
        };

        // Act
        render(<RecommendationCard recommendation={recommendationWithoutAlternatives}/>);

        // Assert
        expect(screen.getByText('No alternatives provided')).toBeInTheDocument();
    });
});
