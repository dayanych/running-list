import { Outlet } from 'react-router-dom';

import { CustomToaster } from '@/shared/ui';

export const BaseLayout = () => {
  return (
    <div className="min-h-screen w-screen bg-background font-sans antialiased">
      <CustomToaster />
      <Outlet />
    </div>
  );
};
