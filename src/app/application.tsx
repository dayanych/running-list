import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { TooltipProvider } from '@/shared/ui';

import { ReactQueryProvider } from './providers';
import { router } from './router';
import { store } from './store';

/** Renders the enabled application with all global providers */
export const Application = () => {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </ReactQueryProvider>
    </Provider>
  );
};
