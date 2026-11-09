import { ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { AuthIntro } from './auth-intro';
import { AuthLinks } from './auth-links';

interface Props {
  title?: string;
  description?: ReactNode;
  contentClassName?: string;
  children: ReactNode;
}

const DEFAULT_DESCRIPTION = (
  <>
    <span className="block sm:inline">Use your Google account.</span>{' '}
    <span className="block sm:inline">No password needed</span>
  </>
);

export const AuthLayout = ({
  title = 'Sign in or create an account',
  description = DEFAULT_DESCRIPTION,
  contentClassName,
  children,
}: Props) => {
  return (
    <main className="grid min-h-0 flex-1 grid-cols-1 content-start lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] lg:content-stretch">
      <AuthIntro />

      <section className="flex flex-col px-6 pb-12 pt-8 sm:px-12 lg:justify-center lg:border-l lg:border-rule lg:py-16 xl:px-20">
        <div
          className={cn(
            'mx-auto w-full max-w-[26rem] border-t border-rule pt-8 lg:mx-0 lg:max-w-[35rem] lg:border-t-0 lg:pt-0',
            contentClassName,
          )}
        >
          <p className="type-meta mb-6 hidden text-ink-muted lg:block">
            Running List
          </p>
          <h2 className="type-section text-balance">{title}</h2>
          <p className="type-help mt-2 text-ink-muted">{description}</p>
          <div className="mt-8 lg:mt-10">{children}</div>
          <AuthLinks />
        </div>
      </section>
    </main>
  );
};
