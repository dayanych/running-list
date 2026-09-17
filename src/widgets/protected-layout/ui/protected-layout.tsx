import { Outlet } from 'react-router-dom';

import { appConfig } from '@/shared/config';
import { Header } from '@/widgets';

export const ProtectedLayout = () => {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <Header />
      <Outlet />
      {appConfig.supportEmail && (
        <footer className="type-help container mt-auto py-4 text-center text-muted-foreground">
          Questions or feedback? Email{' '}
          <a
            href={`mailto:${appConfig.supportEmail}`}
            className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {appConfig.supportEmail}
          </a>
        </footer>
      )}
    </div>
  );
};
