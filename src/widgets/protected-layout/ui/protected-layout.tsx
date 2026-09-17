import { Outlet } from 'react-router-dom';

import { Footer } from '@/shared/ui';
import { Header } from '@/widgets';

export const ProtectedLayout = () => {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
