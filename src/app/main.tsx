import './styles/global.css';

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import { UnavailablePage } from '@/pages/unavailable';
import { appConfig } from '@/shared/config/app.config';
import { Loader } from '@/shared/ui/laoder';

const Application = lazy(() =>
  import('./application').then((module) => ({
    default: module.Application,
  })),
);

if (appConfig.isDisabled) {
  document.title = 'Temporarily unavailable | Running List';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {appConfig.isDisabled ? (
      <UnavailablePage />
    ) : (
      <Suspense fallback={<Loader fullScreen label="Loading Running List" />}>
        <Application />
      </Suspense>
    )}
  </React.StrictMode>,
);
