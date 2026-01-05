import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { appConfig } from '@/shared/config';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui';

interface Props {
  children: ReactNode;
}

export const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Login with your email</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            Have a trouble? Write email to{' '}
            <Link
              to={`mailto:${appConfig.supportEmail}`}
              className="text-primary"
            >
              {appConfig.supportEmail}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
