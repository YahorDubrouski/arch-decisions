import {afterEach, describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {DecisionsResponse} from '@/domain/decisions';
import {clearDecisions, saveDecisions} from '@/features/decisions/services/decisionsStorage';
import {DecisionsPage} from '../DecisionsPage';

const sampleDecisions: DecisionsResponse = {
    compute: {
        category: 'compute',
        recommended: 'ECS',
        alternatives: ['EC2'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'medium',
        },
    },
    secrets: {
        category: 'secrets',
        recommended: 'AWS Secrets Manager',
        alternatives: ['Vault'],
        tradeOffs: {
            cost: 'medium',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
    cicd: {
        category: 'cicd',
        recommended: 'GitHub Actions',
        alternatives: ['GitLab CI'],
        tradeOffs: {
            cost: 'low',
            complexity: 'low',
            risk: 'low',
            operationalOverhead: 'low',
        },
    },
};

describe('DecisionsPage', () => {
    afterEach(() => {
        clearDecisions();
    });

    it('renders empty state when no decisions are stored', () => {
        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {name: /architecture decisions/i})).toBeInTheDocument();
        expect(screen.getByText(/no decisions to display yet/i)).toBeInTheDocument();
    });

    it('renders recommendation summary when decisions are stored', () => {
        saveDecisions(sampleDecisions);

        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByText(/ECS/)).toBeInTheDocument();
        expect(screen.getByText(/AWS Secrets Manager/)).toBeInTheDocument();
        expect(screen.getByText(/GitHub Actions/)).toBeInTheDocument();
        expect(screen.queryByText(/no decisions to display yet/i)).not.toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <MemoryRouter>
                <DecisionsPage/>
            </MemoryRouter>
        );

        expect(screen.getByRole('link', {name: /edit context/i})).toHaveAttribute('href', '/context');
        expect(screen.getByRole('link', {name: /home/i})).toHaveAttribute('href', '/');
    });
});
