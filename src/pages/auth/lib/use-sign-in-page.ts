import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import { AuthDal } from '@/entities/auth';

export const useSignInPage = () => {
  const {
    mutate: signInWithGoogle,
    isPending,
    data: isRedirecting,
    reset,
  } = useMutation({
    mutationKey: ['sign-in-google'],
    mutationFn: () => AuthDal.signInWithGoogle(),
  });

  // Going back from Google can restore this page from the back/forward cache
  // with the redirect still marked as in progress
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset();
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [reset]);

  // The page stays on screen until the browser leaves for Google, so the
  // button keeps its pending state instead of flashing back
  const isGooglePending = isPending || Boolean(isRedirecting);

  const handleGoogleSignIn = () => signInWithGoogle();

  return { handleGoogleSignIn, isGooglePending };
};
