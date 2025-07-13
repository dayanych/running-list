import { Outlet } from 'react-router-dom';

import { Loader } from '@/shared/ui';
import { ProtectedLayout, PublicLayout } from '@/widgets';

import { useAuthInjector } from '../lib/use-auth-injector';

export const AuthInjector = () => {
  const { isLoading, user } = useAuthInjector();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <PublicLayout>
        <Outlet />
      </PublicLayout>
    );
  }

  return (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  );
};
