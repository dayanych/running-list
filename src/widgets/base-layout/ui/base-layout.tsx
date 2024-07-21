import { Outlet } from 'react-router-dom';
import { CustomToaster } from 'src/shared/ui/custom-toaster';

export const BaseLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <CustomToaster />
      <Outlet />
    </div>
  );
};
