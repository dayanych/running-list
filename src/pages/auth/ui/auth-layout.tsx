import { ReactNode } from 'react';

import { appConfig } from '@/shared/config';
import { cn } from '@/shared/lib';

interface Props {
  title?: string;
  description?: ReactNode;
  contentClassName?: string;
  children: ReactNode;
}

// The preview is hidden below lg, so small screens get a 1px GIF instead of the screenshot
const PREVIEW_PLACEHOLDER_SRC =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const DEFAULT_DESCRIPTION = (
  <>
    <span className="block sm:inline">Use your email or Google account.</span>{' '}
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
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)]">
      <div className="hidden flex-col justify-center px-12 py-16 lg:flex xl:px-16">
        <div className="max-w-[56rem]">
          <p className="type-hero max-w-[36rem] text-balance">
            Your week in one table
          </p>
          <p className="type-lead mt-6 max-w-[32rem] text-ink-muted">
            <span className="block">Tasks in rows, days in columns</span>
          </p>
          <picture className="mt-12 block">
            <source
              media="(max-width: 1023px)"
              srcSet={PREVIEW_PLACEHOLDER_SRC}
            />
            {/* The offsets cancel the padding baked into the screenshot, so its
                content lines up with the text above */}
            <img
              src="/images/running-list-table.png"
              alt="Running List week view with seven tasks and their daily marks"
              width={2848}
              height={1124}
              className="w-full -translate-x-[2.84%] -translate-y-[7.3%]"
            />
          </picture>
        </div>
      </div>

      <section className="flex flex-col px-6 py-12 sm:justify-center sm:px-12 lg:border-l lg:border-rule lg:py-16 xl:px-20">
        <div
          className={cn(
            'mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-[35rem]',
            contentClassName,
          )}
        >
          <p className="type-meta text-ink-muted">Running List</p>
          <h1 className="type-week mt-6 text-balance">{title}</h1>
          <p className="type-help mt-2 text-ink-muted">{description}</p>
          <div className="mt-10">{children}</div>
          {appConfig.supportEmail && (
            <p className="type-help mt-10 text-ink-muted">
              Trouble signing in? Email{' '}
              <a
                href={`mailto:${appConfig.supportEmail}`}
                className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {appConfig.supportEmail}
              </a>
            </p>
          )}
        </div>
      </section>
    </main>
  );
};
