import {ErrorBoundary} from './ErrorBoundary';
import {AppProviders} from './providers/AppProviders';
import {AppRoutes} from './routes';
import {AppShell} from '@/shared/layout/AppShell';

export function App() {
    return (
        <AppProviders>
            <ErrorBoundary>
                <AppShell>
                    <AppRoutes/>
                </AppShell>
            </ErrorBoundary>
        </AppProviders>
    );
}
