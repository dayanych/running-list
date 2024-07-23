import { Navigate, RouteObject } from 'react-router-dom';

import { SignInPage, SignUpPage } from '@/pages/auth';
import { NotFoundPage } from '@/pages/not-found';
import { AuthInjector } from '@/widgets/auth-injector';
import { BaseLayout } from '@/widgets/base-layout';
import { ProtectedLayout } from '@/widgets/protected-layout';
import { PublicLayout } from '@/widgets/public-layout';

import { App } from '../app';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <AuthInjector />,
        children: [
          {
            path: '/',
            element: <Navigate to="/app" />,
          },
          {
            path: '/',
            element: <PublicLayout />,
            children: [
              {
                path: '/sign-in',
                element: <SignInPage />,
              },
              {
                path: '/sign-up',
                element: <SignUpPage />,
              },
            ],
          },
          {
            path: '/app',
            element: <ProtectedLayout />,
            children: [
              {
                path: '',
                element: <App />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export { routes };
