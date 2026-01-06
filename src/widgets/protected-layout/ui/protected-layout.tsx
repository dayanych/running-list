import { Outlet } from 'react-router-dom';

import { Header } from '@/widgets';

export const ProtectedLayout = () => {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <Outlet />
    </div>
  );
};
