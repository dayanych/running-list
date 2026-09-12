import { Outlet } from 'react-router-dom';

import { Toaster } from '@/shared/ui';
import { ErrorBoundary } from '@/widgets/error-boundary';

export const BaseLayout = () => {
  return (
    <div className="min-h-screen w-screen font-sans antialiased">
      <Toaster />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
