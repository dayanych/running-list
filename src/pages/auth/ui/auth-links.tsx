import { Link } from 'react-router-dom';

import { appConfig, routesPaths } from '@/shared/config';
import { cn } from '@/shared/lib';

const linkClassName =
  'underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4';

/** Links a guest to the guide, the legal documents, and support */
export const AuthLinks = () => (
  <>
    <p className="type-help mt-8 text-ink-muted">
      New to Running List?{' '}
      <Link to={`/${routesPaths.guide}`} className={linkClassName}>
        Read the guide
      </Link>
    </p>
    <nav
      aria-label="Legal documents"
      className="type-help mt-2 flex gap-6 text-ink-muted"
    >
      <Link
        to={`/${routesPaths.privacy}`}
        className={cn(linkClassName, 'min-h-11 content-center')}
      >
        Privacy
      </Link>
      <Link
        to={`/${routesPaths.terms}`}
        className={cn(linkClassName, 'min-h-11 content-center')}
      >
        Terms
      </Link>
    </nav>
    {appConfig.supportEmail && (
      <p className="type-help mt-6 text-ink-muted">
        Trouble signing in? Email{' '}
        <a
          href={`mailto:${appConfig.supportEmail}`}
          className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {appConfig.supportEmail}
        </a>
      </p>
    )}
  </>
);
