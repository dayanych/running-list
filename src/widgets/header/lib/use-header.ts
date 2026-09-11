import { useCallback } from 'react';

import { AuthDal } from '@/entities/auth';
import { useUser } from '@/shared/lib';

export const useHeader = () => {
  const user = useUser();
  const onLogout = useCallback(() => {
    void AuthDal.logout();
  }, []);

  return {
    user,
    onLogout,
  };
};
