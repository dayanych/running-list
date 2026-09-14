import { LuLoaderCircle } from 'react-icons/lu';
import { Link } from 'react-router-dom';

import { routesPaths } from '@/shared/config';
import { Button, Form, FormField, FormItem, Input } from '@/shared/ui';

import { useEmailLinkHandlerPage } from '../lib/use-email-link-handler-page';
import {
  authButtonClassName,
  authInputClassName,
  authLabelClassName,
} from './auth-form-classes';
import { AuthLayout } from './auth-layout';

export const EmailLinkHandlerPage = () => {
  const { form, handleSubmit, isPending, isLinkValid, hasFailed, needsEmail } =
    useEmailLinkHandlerPage();

  if (!isLinkValid) {
    return (
      <AuthLayout>
        <div className="space-y-6">
          <p className="type-help text-ink-muted">
            This sign-in link is invalid or expired
          </p>
          <Button asChild className={authButtonClassName}>
            <Link to={`/${routesPaths.signInEmailLinkRequest}`}>
              Request a new link
            </Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (!needsEmail) {
    return (
      <AuthLayout>
        <p
          role="status"
          className="type-help flex items-center gap-3 text-ink-muted"
        >
          <LuLoaderCircle className="h-4 w-4 animate-spin" />
          Signing you in...
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
            noValidate
          >
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
                    required
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={authButtonClassName}
              disabled={isPending || hasFailed}
            >
              {isPending && !hasFailed ? (
                <>
                  <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm sign-in'
              )}
            </Button>
          </form>
        </Form>
        {hasFailed && (
          <p className="type-help text-destructive">
            We couldn&apos;t finish signing you in.{' '}
            <Link
              to={`/${routesPaths.signInEmailLinkRequest}`}
              className="underline underline-offset-4"
            >
              Request a new link
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
};
