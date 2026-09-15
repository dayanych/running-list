import { ReactNode } from 'react';

import { appConfig } from '@/shared/config/app.config';
import { cn } from '@/shared/lib/cn';

type StatusScreenMarker = 'broken' | 'missing' | 'paused';

interface Props {
  title: string;
  description: ReactNode;
  marker: StatusScreenMarker;
  actions: ReactNode;
  role?: 'alert';
}

// Echoes the route loader's week line, with one day called out
const WEEK_DOTS = Array.from({ length: 7 });
const MARKED_DOT_INDEX = 4;

const markedDotClassName: Record<StatusScreenMarker, string> = {
  broken: 'bg-destructive',
  missing: 'border border-anchor bg-background',
  paused: 'bg-primary',
};

export const statusScreenActionClassName =
  'type-row h-12 w-full rounded-none sm:w-auto sm:px-8';

/**
 * Full-screen status page for errors and missing routes
 *
 * @param props - Screen title, description, week line marker and actions
 * @returns Left-aligned status screen in the auth page style
 */
export const StatusScreen = ({
  title,
  description,
  marker,
  actions,
  role,
}: Props) => {
  return (
    <main className="flex min-h-screen w-full flex-col bg-background px-6 py-12 sm:items-center sm:justify-center sm:px-12">
      <div className="w-full max-w-[35rem]" role={role}>
        <div
          className="relative flex w-44 items-center justify-between"
          aria-hidden="true"
        >
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rule" />
          {WEEK_DOTS.map((_, index) => (
            <span
              key={index}
              className={cn(
                'relative h-1.5 w-1.5 rounded-full ring-4 ring-background',
                index === MARKED_DOT_INDEX
                  ? markedDotClassName[marker]
                  : 'bg-anchor',
              )}
            />
          ))}
        </div>

        <h1 className="type-week mt-10 text-balance text-foreground">
          {title}
        </h1>
        <p className="type-help mt-2 text-ink-muted">{description}</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">{actions}</div>

        {appConfig.supportEmail && (
          <p className="type-help mt-10 text-ink-muted">
            Need help? Email{' '}
            <a
              href={`mailto:${appConfig.supportEmail}`}
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {appConfig.supportEmail}
            </a>
          </p>
        )}
      </div>
    </main>
  );
};
