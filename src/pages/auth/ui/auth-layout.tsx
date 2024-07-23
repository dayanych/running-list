import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

interface Props {
  state: 'signIn' | 'signUp';
  children: ReactNode;
}

export const AuthLayout = ({ state, children }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            {state === 'signIn'
              ? 'Login with your email'
              : 'Create your account'}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            {state === 'signIn' && (
              <>
                Don&apos;t have an account?{' '}
                <Link to="/sign-up" className="text-primary">
                  Sign Up
                </Link>
              </>
            )}
            {state === 'signUp' && (
              <>
                Already have an account?{' '}
                <Link to="/sign-in" className="text-primary">
                  Sign In
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
