import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AuthDal } from '@/entities/auth';
import { useUser } from '@/shared/lib';

export const useAuthInjector = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthDal.listenAuthStateChange(dispatch, setIsLoading);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, navigate, isLoading]);

  return { isLoading, user };
};
