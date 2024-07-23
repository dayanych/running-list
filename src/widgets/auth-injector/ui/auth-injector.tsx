import { Outlet } from 'react-router-dom';

import { Loader } from '@/shared/ui/laoder';

import { useAuthInjector } from '../lib/use-auth-injector';

export const AuthInjector = () => {
  const { isLoading } = useAuthInjector();

  return isLoading ? <Loader /> : <Outlet />;
};
