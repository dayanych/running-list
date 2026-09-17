import { Outlet } from 'react-router-dom';

import { Toaster } from '@/shared/ui';
import { ErrorBoundary } from '@/widgets/error-boundary';

export const BaseLayout = () => {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col font-sans antialiased">
      <Toaster />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
