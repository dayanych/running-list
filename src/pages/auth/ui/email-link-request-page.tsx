import { LuLoaderCircle, LuMail } from 'react-icons/lu';

import { cn } from '@/shared/lib';
import { Button, Form, FormField, FormItem, Input } from '@/shared/ui';

import { useEmailLinkRequestPage } from '../lib/use-email-link-request-page';
import {
  authButtonClassName,
  authInputClassName,
  authLabelClassName,
} from './auth-form-classes';
import { AuthLayout } from './auth-layout';

export const EmailLinkRequestPage = () => {
  const {
    form,
    handleSubmit,
    isPending,
    sentTo,
    transitionDirection,
    handleChangeEmail,
    handleGoogleSignIn,
    isGooglePending,
  } = useEmailLinkRequestPage();

  // The two states always alternate, so swapping the class restarts the
  // animation without remounting the block and dropping focus
  const transitionClassName = cn(
    transitionDirection === 'forward' && 'week-content-enter-forward',
    transitionDirection === 'backward' && 'week-content-enter-backward',
  );

  return (
    <AuthLayout
      contentClassName={transitionClassName}
      title={sentTo ? 'Check your email' : undefined}
      description={
        sentTo ? (
          <>
            We sent a sign-in link to{' '}
            <span className="font-medium text-foreground [overflow-wrap:anywhere]">
              {sentTo}
            </span>
          </>
        ) : undefined
      }
    >
      <div className={sentTo ? 'space-y-3' : 'space-y-6'}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* The field only remounts after "Use a different email", and then
                the cursor goes straight back into it */}
            {!sentTo && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem label="Email" labelClassName={authLabelClassName}>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={authInputClassName}
                      autoFocus={form.formState.isSubmitSuccessful}
                      required
                    />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              variant={sentTo ? 'outline' : 'default'}
              className={authButtonClassName}
              disabled={isPending || isGooglePending}
            >
              {isPending ? (
                <>
                  <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : sentTo ? (
                'Resend link'
              ) : (
                <>
                  <LuMail className="mr-2 h-4 w-4" />
                  Email me a sign-in link
                </>
              )}
            </Button>
          </form>
        </Form>
        {sentTo ? (
          <Button
            type="button"
            variant="outline"
            className={authButtonClassName}
            onClick={handleChangeEmail}
            disabled={isPending}
          >
            Use a different email
          </Button>
        ) : (
          <>
            <div className="type-meta flex items-center gap-4 text-ink-muted">
              <div className="h-px flex-1 bg-rule" />
              <span>or</span>
              <div className="h-px flex-1 bg-rule" />
            </div>
            <Button
              type="button"
              variant="outline"
              className={authButtonClassName}
              onClick={handleGoogleSignIn}
              disabled={isPending || isGooglePending}
            >
              {isGooglePending ? (
                <>
                  <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Continue with Google'
              )}
            </Button>
          </>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {sentTo && `Sign-in link sent to ${sentTo}`}
      </p>
    </AuthLayout>
  );
};
