import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { routesPaths } from '@/shared/config';
import { useUser } from '@/shared/lib/hooks/use-user';

export const useProtectedLayout = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      navigate(`/${routesPaths.signIn}`);
    }
  }, [navigate, user]);
};
