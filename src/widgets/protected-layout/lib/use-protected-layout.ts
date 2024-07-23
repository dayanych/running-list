import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/shared/lib/hooks/use-user';

export const useProtectedLayout = () => {
  const navigate = useNavigate();
  const user = useUser();

  const navigateToAuth = useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      navigateToAuth();
    }
  }, [user, navigateToAuth]);
};
