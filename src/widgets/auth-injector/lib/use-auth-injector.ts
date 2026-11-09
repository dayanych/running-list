import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthDal } from '@/entities/auth';
import { routesPaths } from '@/shared/config';
import { useUser } from '@/shared/lib';

import { shouldRedirectGuest } from './should-redirect-guest';

export const useAuthInjector = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => AuthDal.listenAuthStateChange(dispatch, setIsLoading), []);

  useEffect(() => {
    if (isLoading) return;

    if (shouldRedirectGuest(location.pathname, Boolean(user))) {
      navigate(`/${routesPaths.base}`, { replace: true });
    }
  }, [user, navigate, isLoading, location.pathname]);

  return { isLoading, user };
};
