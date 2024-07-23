import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AuthDal } from '@/entities/auth';

export const useAuthInjector = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthDal.listenAuthStateChange(dispatch, setIsLoading);
  }, []);

  return { isLoading };
};
