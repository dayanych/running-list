import { RouteObject } from 'react-router-dom';
import { NotFoundPage } from 'src/pages/not-found';
import { AuthInjector } from 'src/widgets/auth-injector';
import { BaseLayout } from 'src/widgets/base-layout';
import { ProtectedLayout } from 'src/widgets/protected-layout';
import { PublicLayout } from 'src/widgets/public-layout';

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
            element: <PublicLayout />,
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
