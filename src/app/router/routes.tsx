import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import {
  NotFoundPage,
  SettingsPage,
  SignInPage,
  SignUpPage,
  WeekPage,
} from '@/pages';
import {
  AuthInjector,
  BaseLayout,
  ProtectedLayout,
  PublicLayout,
} from '@/widgets';

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
                path: ':year',
                element: <Outlet />,
                children: [
                  {
                    path: ':week',
                    element: <WeekPage />,
                  },
                ],
              },
              {
                path: 'settings',
                element: <SettingsPage />,
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
