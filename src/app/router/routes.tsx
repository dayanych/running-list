import { lazy, ReactNode, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { CurrentWeekRedirectPage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { YearPage } from '@/pages/year';
import { routesPaths } from '@/shared/config';
import { Loader } from '@/shared/ui';
import {
  AuthInjector,
  BaseLayout,
  ProtectedLayout,
  PublicLayout,
} from '@/widgets';

const EmailLinkHandlerPage = lazy(() =>
  import('@/pages/auth/ui/email-link-handler-page').then((module) => ({
    default: module.EmailLinkHandlerPage,
  })),
);
const EmailLinkRequestPage = lazy(() =>
  import('@/pages/auth/ui/email-link-request-page').then((module) => ({
    default: module.EmailLinkRequestPage,
  })),
);
const SignInPage = lazy(() =>
  import('@/pages/auth/ui/sign-in-page').then((module) => ({
    default: module.SignInPage,
  })),
);
const SignUpPage = lazy(() =>
  import('@/pages/auth/ui/sign-up-page').then((module) => ({
    default: module.SignUpPage,
  })),
);
const WeekPage = lazy(() =>
  import('@/pages/week-page/ui/week-page').then((module) => ({
    default: module.WeekPage,
  })),
);

const GuidePage = lazy(() =>
  import('@/pages/guide/ui/guide-page').then((module) => ({
    default: module.GuidePage,
  })),
);

const withRouteLoader = (element: ReactNode, label: string) => (
  <Suspense fallback={<Loader label={label} />}>
    <div className="route-page-enter flex min-h-0 flex-1 flex-col">
      {element}
    </div>
  </Suspense>
);

const publicRoutes = [
  {
    path: routesPaths.signInEmailLinkRequest,
    element: withRouteLoader(<EmailLinkRequestPage />, 'Loading sign in'),
  },
  {
    path: routesPaths.signInEmailLink,
    element: withRouteLoader(<EmailLinkHandlerPage />, 'Loading sign in'),
  },
  {
    path: routesPaths.signIn,
    element: withRouteLoader(<SignInPage />, 'Loading sign in'),
  },
  {
    path: routesPaths.signUp,
    element: withRouteLoader(<SignUpPage />, 'Loading sign up'),
  },
];

const protectedRoutes = [
  {
    index: true,
    element: <CurrentWeekRedirectPage />,
  },
  {
    path: routesPaths.year,
    element: <YearPage />,
    children: [
      {
        path: routesPaths.week,
        element: withRouteLoader(<WeekPage />, 'Loading week'),
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
        path: routesPaths.guide,
        element: withRouteLoader(<GuidePage />, 'Loading guide'),
      },
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
