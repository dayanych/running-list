import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/shared/lib/hooks/use-user';

export const usePublicLayout = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
};
