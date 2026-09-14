import { Component, ErrorInfo, ReactNode } from 'react';

import { Button, StatusScreen, statusScreenActionClassName } from '@/shared/ui';

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
        <StatusScreen
          role="alert"
          marker="broken"
          title="Something went wrong"
          description="The page hit an unexpected error. Reload it to try again"
          actions={
            <>
              <Button
                className={statusScreenActionClassName}
                onClick={this.handleReload}
              >
                Reload page
              </Button>
              <Button
                asChild
                variant="outline"
                className={statusScreenActionClassName}
              >
                <a href="/">Open this week</a>
              </Button>
            </>
          }
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
