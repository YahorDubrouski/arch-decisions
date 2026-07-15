import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    it('renders alternatives and trade-offs when expanded by default', () => {
        render(<DecisionCard decision={sampleDecision}/>);

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

    it('collapses and expands details on toggle', async () => {
        const user = userEvent.setup();
        render(<DecisionCard decision={sampleDecision}/>);

        await user.click(screen.getByRole('button', {name: /hide compute details/i}));

        expect(screen.getByRole('button', {name: /show compute details/i})).toHaveAttribute(
            'aria-expanded',
            'false'
        );
        expect(screen.getByText('EC2')).not.toBeVisible();
        expect(screen.getByText('Cost')).not.toBeVisible();
        expect(screen.getByText('ECS')).toBeVisible();

        await user.click(screen.getByRole('button', {name: /show compute details/i}));

        expect(screen.getByRole('button', {name: /hide compute details/i})).toHaveAttribute(
            'aria-expanded',
            'true'
        );
        expect(screen.getByText('EC2')).toBeVisible();
        expect(screen.getByText('Cost')).toBeVisible();
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
