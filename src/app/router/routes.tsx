import { Outlet, RouteObject } from 'react-router-dom';

import {
  NotFoundPage,
  SettingsPage,
  SignInPage,
  SignUpPage,
  WeekPage,
} from '@/pages';
import { AuthInjector, BaseLayout } from '@/widgets';

const publicRoutes = [
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
];

const protectedRoutes = [
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
];

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <AuthInjector />,
        children: [...publicRoutes, ...protectedRoutes],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export { routes };
