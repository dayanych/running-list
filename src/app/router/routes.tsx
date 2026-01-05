import { RouteObject } from 'react-router-dom';

import {
  CurrentWeekRedirectPage,
  EmailLinkHandlerPage,
  EmailLinkRequestPage,
  NotFoundPage,
  SettingsPage,
  SignInPage,
  SignUpPage,
  WeekPage,
  YearPage,
} from '@/pages';
import { routesPaths } from '@/shared/config';
import {
  AuthInjector,
  BaseLayout,
  ProtectedLayout,
  PublicLayout,
} from '@/widgets';

const publicRoutes = [
  {
    path: routesPaths.signInEmailLinkRequest,
    element: <EmailLinkRequestPage />,
  },
  {
    path: routesPaths.signInEmailLink,
    element: <EmailLinkHandlerPage />,
  },
  {
    path: routesPaths.signIn,
    element: <SignInPage />,
  },
  {
    path: routesPaths.signUp,
    element: <SignUpPage />,
  },
];

const protectedRoutes = [
  {
    index: true,
    element: <CurrentWeekRedirectPage />,
  },
  {
    path: routesPaths.settings,
    element: <SettingsPage />,
  },
  {
    path: routesPaths.year,
    element: <YearPage />,
    children: [
      {
        path: routesPaths.week,
        element: <WeekPage />,
      },
    ],
  },
];

const routes: RouteObject[] = [
  {
    path: routesPaths.base,
    element: <BaseLayout />,
    children: [
      {
        path: routesPaths.base,
        element: <AuthInjector />,
        children: [
          {
            element: <ProtectedLayout />,
            children: protectedRoutes,
          },
          {
            element: <PublicLayout />,
            children: publicRoutes,
          },
        ],
      },
      {
        path: routesPaths.notFound,
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export { routes };
