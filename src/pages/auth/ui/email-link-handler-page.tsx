import { LuLoaderCircle } from 'react-icons/lu';
import { Link } from 'react-router-dom';

import { routesPaths } from '@/shared/config';
import { Button, Form, FormField, FormItem, Input } from '@/shared/ui';

import { useEmailLinkHandlerPage } from '../lib/use-email-link-handler-page';
import { AuthLayout } from './auth-layout';

export const EmailLinkHandlerPage = () => {
  const { form, handleSubmit, isPending, isLinkValid, hasFailed, needsEmail } =
    useEmailLinkHandlerPage();

  if (!isLinkValid) {
    return (
      <AuthLayout>
        <div className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            This sign-in link is invalid or expired.
          </p>
          <Button asChild className="w-full">
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
        <div className="flex flex-col items-center gap-2 text-center">
          <LuLoaderCircle className="h-5 w-5 animate-spin" />
          <p className="text-sm text-muted-foreground">Signing you in...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <p className="text-center text-sm text-muted-foreground">
          Confirm your email to finish signing in.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem required label="Email">
                  <Input {...field} />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
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
          <p className="text-sm text-destructive">
            We couldn&apos;t finish signing you in. Request a new link.
          </p>
        )}
        <p className="text-center text-sm text-muted-foreground">
          Need a new link?{' '}
          <Link
            to={`/${routesPaths.signInEmailLinkRequest}`}
            className="text-primary"
          >
            Send another
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
