import {ReactElement, ReactNode} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import {AppProviders} from '@/app/providers/AppProviders';

function TestProviders({children}: {children: ReactNode}) {
    return <AppProviders>{children}</AppProviders>;
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
    return render(ui, {wrapper: TestProviders, ...options});
}
