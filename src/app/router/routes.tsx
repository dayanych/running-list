import { lazy, ReactNode, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

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

const SignInPage = lazy(() =>
  import('@/pages/auth/ui/sign-in-page').then((module) => ({
    default: module.SignInPage,
  })),
);
const WeekPage = lazy(() =>
  import('@/pages/week-page/ui/week-page').then((module) => ({
    default: module.WeekPage,
  })),
);
const SettingsPage = lazy(() =>
  import('@/pages/settings/ui/settings-page').then((module) => ({
    default: module.SettingsPage,
  })),
);
const GuidePage = lazy(() =>
  import('@/pages/guide/ui/guide-page').then((module) => ({
    default: module.GuidePage,
  })),
);
const PrivacyPage = lazy(() =>
  import('@/pages/legal/ui/privacy-page').then((module) => ({
    default: module.PrivacyPage,
  })),
);
const TermsPage = lazy(() =>
  import('@/pages/legal/ui/terms-page').then((module) => ({
    default: module.TermsPage,
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
    index: true,
    element: (
      <CurrentWeekRedirectPage
        guestElement={withRouteLoader(<SignInPage />, 'Loading sign in')}
      />
    ),
  },
  {
    path: routesPaths.signIn,
    element: <Navigate to={`/${routesPaths.base}`} replace />,
  },
];

const protectedRoutes = [
  {
    path: routesPaths.settings,
    element: withRouteLoader(<SettingsPage />, 'Loading settings'),
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
        path: routesPaths.privacy,
        element: withRouteLoader(<PrivacyPage />, 'Loading privacy policy'),
      },
      {
        path: routesPaths.terms,
        element: withRouteLoader(<TermsPage />, 'Loading terms of service'),
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
