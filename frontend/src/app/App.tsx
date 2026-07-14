import {ErrorBoundary} from './ErrorBoundary';
import {AppProviders} from './providers/AppProviders';
import {AppRoutes} from './routes';

export function App() {
    return (
        <AppProviders>
            <ErrorBoundary>
                <AppRoutes/>
            </ErrorBoundary>
        </AppProviders>
    );
}
