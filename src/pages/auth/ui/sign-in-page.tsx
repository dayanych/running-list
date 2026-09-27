import { LuLoaderCircle } from 'react-icons/lu';

import { Button } from '@/shared/ui';

import { useSignInPage } from '../lib/use-sign-in-page';
import { authButtonClassName } from './auth-form-classes';
import { AuthLayout } from './auth-layout';

export const SignInPage = () => {
  const { handleGoogleSignIn, isGooglePending } = useSignInPage();

  return (
    <AuthLayout>
      <Button
        type="button"
        className={authButtonClassName}
        onClick={handleGoogleSignIn}
        disabled={isGooglePending}
      >
        {isGooglePending ? (
          <>
            <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Continue with Google'
        )}
      </Button>
    </AuthLayout>
  );
};
