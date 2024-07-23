import { Outlet } from 'react-router-dom';

import { useProtectedLayout } from '../lib/use-protected-layout';

export const ProtectedLayout = () => {
  useProtectedLayout();

  return <Outlet />;
};
