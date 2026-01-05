import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthDal } from '@/entities/auth';
import { routesPaths } from '@/shared/config';
import { useUser } from '@/shared/lib';

export const useAuthInjector = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthDal.listenAuthStateChange(dispatch, setIsLoading);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (
      location.pathname.includes(routesPaths.signInEmailLink) ||
      location.pathname.includes(routesPaths.signInEmailLinkRequest)
    )
      return;

    if (!user) {
      navigate(`/${routesPaths.signInEmailLinkRequest}`, { replace: true });
    }
  }, [user, navigate, isLoading, location.pathname]);

  return { isLoading, user };
};
