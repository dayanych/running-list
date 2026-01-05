import { Outlet } from 'react-router-dom';

import { Header } from '@/widgets';

import { useProtectedLayout } from '../lib/use-protected-layout';

export const ProtectedLayout = () => {
  useProtectedLayout();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <Outlet />
    </div>
  );
};
