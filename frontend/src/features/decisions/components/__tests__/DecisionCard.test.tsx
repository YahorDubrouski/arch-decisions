import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {DecisionResult} from '@/domain/decisions';
import {DecisionCard} from '../DecisionCard';

const sampleDecision: DecisionResult = {
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

describe('DecisionCard', () => {
    it('renders category title and recommended option', () => {
        render(<DecisionCard decision={sampleDecision}/>);

        expect(screen.getByRole('heading', {name: 'Compute'})).toBeInTheDocument();
        expect(screen.getByText('ECS')).toBeInTheDocument();
    });

    it('renders alternatives list', () => {
        render(<DecisionCard decision={sampleDecision}/>);

        expect(screen.getByText('EC2')).toBeInTheDocument();
        expect(screen.getByText('Lambda')).toBeInTheDocument();
    });

    it('renders trade-off labels and values', () => {
        render(<DecisionCard decision={sampleDecision}/>);

        expect(screen.getByText('Cost')).toBeInTheDocument();
        expect(screen.getByText('Complexity')).toBeInTheDocument();
        expect(screen.getByText('Risk')).toBeInTheDocument();
        expect(screen.getByText('Ops overhead')).toBeInTheDocument();
        expect(screen.getAllByText('medium').length).toBeGreaterThan(0);
        expect(screen.getByText('low')).toBeInTheDocument();
    });

    it('shows message when alternatives are empty', () => {
        render(
            <DecisionCard
                decision={{
                    ...sampleDecision,
                    alternatives: [],
                }}
            />
        );

        expect(screen.getByText('No alternatives provided')).toBeInTheDocument();
    });
});
