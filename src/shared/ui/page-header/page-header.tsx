import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Logo } from '@/shared/ui/logo';

interface Props {
  children: ReactNode;
}

/** Renders the shared brand and navigation layout for application pages */
export const PageHeader = ({ children }: Props) => {
  return (
    <header className="border-b border-rule bg-background">
      <div className="container flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Link
          to="/"
          className="type-section flex min-h-11 items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
        >
          <Logo />
          Running List
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4">
          {children}
        </nav>
      </div>
    </header>
  );
};
