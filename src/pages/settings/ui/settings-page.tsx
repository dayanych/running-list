import { useLayoutEffect } from 'react';
import { LuLoaderCircle, LuLogOut, LuTrash2 } from 'react-icons/lu';

import { usePageMeta, useUser } from '@/shared/lib';
import { Button } from '@/shared/ui';

import { useSettingsPage } from '../lib/use-settings-page';

const sectionClassName =
  'grid gap-6 py-8 sm:py-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12';

/** Presents account information, session controls, and account deletion */
export const SettingsPage = () => {
  const user = useUser();
  const {
    closeDeleteConfirmation,
    deleteAccount,
    isDeleteConfirmationOpen,
    isDeletePending,
    isLogoutPending,
    logout,
    toggleDeleteConfirmation,
  } = useSettingsPage();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  usePageMeta({ title: 'Settings | Running List', noindex: true });

  if (!user) return null;

  return (
    <main className="container flex-1 pb-16 pt-12 sm:pb-24 sm:pt-20">
      <header className="max-w-2xl">
        <h1 className="type-hero text-balance">Settings</h1>
        <p className="type-lead mt-6 max-w-xl text-ink-muted">
          Review your account, end your session, or permanently remove your
          Running List data
        </p>
      </header>

      <div className="mt-12 max-w-3xl divide-y divide-rule border-y border-rule sm:mt-16">
        <section className={sectionClassName} aria-labelledby="account-heading">
          <div>
            <h2 id="account-heading" className="type-section">
              Account
            </h2>
            <p className="type-help mt-2 text-ink-muted">
              Information provided by Google when you signed in
            </p>
          </div>
          <dl className="min-w-0 divide-y divide-rule-faint">
            <div className="grid gap-1 pb-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
              <dt className="type-ui text-ink-muted">Name</dt>
              <dd className="type-task min-w-0 break-words">
                {user.name || 'Not provided'}
              </dd>
            </div>
            <div className="grid gap-1 pt-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
              <dt className="type-ui text-ink-muted">Email</dt>
              <dd className="type-task min-w-0 break-words">{user.email}</dd>
            </div>
          </dl>
        </section>

        <section className={sectionClassName} aria-labelledby="session-heading">
          <div>
            <h2 id="session-heading" className="type-section">
              Session
            </h2>
            <p className="type-help mt-2 text-ink-muted">
              Sign out of your Running List account
            </p>
          </div>
          <div className="flex items-start">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-none px-4"
              disabled={isLogoutPending || isDeletePending}
              onClick={() => logout()}
            >
              {isLogoutPending ? (
                <LuLoaderCircle
                  aria-hidden="true"
                  className="mr-2 size-4 animate-spin motion-reduce:animate-none"
                />
              ) : (
                <LuLogOut aria-hidden="true" className="mr-2 size-4" />
              )}
              {isLogoutPending ? 'Logging out…' : 'Log out'}
            </Button>
          </div>
        </section>

        <section
          className={sectionClassName}
          aria-labelledby="deletion-heading"
        >
          <div>
            <h2 id="deletion-heading" className="type-section text-destructive">
              Delete account
            </h2>
            <p className="type-help mt-2 text-ink-muted">
              Permanently remove your account and everything you saved
            </p>
          </div>
          <div className="min-w-0">
            <p className="type-lead text-ink-muted">
              Your tasks, daily marks, and account information will be deleted.
              This cannot be undone
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 h-11 rounded-none border-destructive px-4 text-destructive hover:border-destructive hover:bg-destructive-wash hover:text-destructive focus-visible:ring-destructive"
              aria-expanded={isDeleteConfirmationOpen}
              aria-controls="delete-account-confirmation"
              disabled={isLogoutPending || isDeletePending}
              onClick={toggleDeleteConfirmation}
            >
              <LuTrash2 aria-hidden="true" className="mr-2 size-4" />
              Delete account
            </Button>

            {isDeleteConfirmationOpen && (
              <div
                id="delete-account-confirmation"
                className="mt-6 border border-destructive bg-destructive-wash p-5 sm:p-6"
              >
                <h3 className="type-task">Delete your account permanently?</h3>
                <p className="type-help mt-2 max-w-xl text-ink-secondary">
                  There is no recovery period. Once deleted, your weekly tasks
                  and progress history cannot be restored
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-11 rounded-none px-4"
                    disabled={isDeletePending}
                    onClick={() => deleteAccount()}
                  >
                    {isDeletePending && (
                      <LuLoaderCircle
                        aria-hidden="true"
                        className="mr-2 size-4 animate-spin motion-reduce:animate-none"
                      />
                    )}
                    {isDeletePending
                      ? 'Deleting account…'
                      : 'Permanently delete account'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-none px-4"
                    disabled={isDeletePending}
                    onClick={closeDeleteConfirmation}
                  >
                    Keep account
                  </Button>
                </div>
                <p className="sr-only" aria-live="polite">
                  {isDeletePending ? 'Deleting your account' : ''}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
