import { Component, ErrorInfo, ReactNode } from 'react';

import { Button } from '../../shared/ui/shadcn';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

const INITIAL_STATE: ErrorBoundaryState = {
  hasError: false,
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = INITIAL_STATE;

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Application error', error, errorInfo);
  }

  handleReload = () => {
    this.setState(INITIAL_STATE);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Something went wrong
            </h1>
            <p className="mt-2 text-muted-foreground">
              We are already working on it. Try reloading the page.
            </p>
          </div>
          <Button onClick={this.handleReload}>Reload page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
