import { Outlet } from 'react-router-dom';

import { CustomToaster } from '@/shared/ui';
import { ErrorBoundary } from '@/widgets/error-boundary';

export const BaseLayout = () => {
  return (
    <div className="dot-bg min-h-screen w-screen font-sans antialiased">
      <CustomToaster />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
