import {Component, type ErrorInfo, type ReactNode} from 'react';
import {ErrorState} from '@/shared/ui/ErrorState';

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {error: null};

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Unhandled application error:', error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({error: null});
    };

    render(): ReactNode {
        if (this.state.error) {
            return (
                <ErrorState
                    message="Something went wrong. Please try again."
                    onRetry={this.handleRetry}
                />
            );
        }

        return this.props.children;
    }
}
