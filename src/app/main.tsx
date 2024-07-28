import './styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { ReactQueryProvider } from './providers';
import { router } from './router';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </Provider>
  </React.StrictMode>,
);
