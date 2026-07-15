import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ArchitectureDecisionFull} from '../ArchitectureDecisionFull';

describe('ArchitectureDecisionFull', () => {
    it('renders markdown headings and lists as HTML', () => {
        render(
            <ArchitectureDecisionFull
                content={'# Architecture Decision Record\n\n## Decision\n\n- **Compute:** ECS\n'}
            />
        );

        expect(
            screen.getByRole('article', {name: 'Architecture decision full document'})
        ).toBeInTheDocument();
        expect(screen.getByRole('heading', {level: 1, name: 'Architecture Decision Record'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {level: 2, name: 'Decision'})).toBeInTheDocument();
        expect(screen.getByText('Compute:')).toBeInTheDocument();
        expect(screen.getByText('ECS')).toBeInTheDocument();
    });
});
