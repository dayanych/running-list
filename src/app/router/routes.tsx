import { Outlet, RouteObject } from 'react-router-dom';

import {
  NotFoundPage,
  SettingsPage,
  SignInPage,
  SignUpPage,
  WeekPage,
} from '@/pages';
import { AuthInjector, BaseLayout } from '@/widgets';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <AuthInjector />,
        children: [
          // Public routes
          {
            path: '/sign-in',
            element: <SignInPage />,
          },
          {
            path: '/sign-up',
            element: <SignUpPage />,
          },
          // Protected routes
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
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export { routes };
