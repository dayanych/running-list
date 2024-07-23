import { Outlet } from 'react-router-dom';

import { usePublicLayout } from '../lib/use-public-layout';

export const PublicLayout = () => {
  usePublicLayout();

  return <Outlet />;
};
