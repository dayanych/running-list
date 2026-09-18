import { appConfig } from '@/shared/config/app.config';

/** Renders the shared application footer with support contact details */
export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="type-help container flex flex-wrap items-center justify-end gap-x-6 gap-y-1 py-3 text-ink-muted">
        {appConfig.supportEmail && (
          <p className="min-w-0 text-right">
            Questions or feedback? Email{' '}
            <a
              href={`mailto:${appConfig.supportEmail}`}
              className="break-words underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {appConfig.supportEmail}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
};
