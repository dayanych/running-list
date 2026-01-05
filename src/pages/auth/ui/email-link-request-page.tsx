import { LuLoaderCircle } from 'react-icons/lu';

import { Button, Form, FormField, FormItem, Input } from '@/shared/ui';

import { useEmailLinkRequestPage } from '../lib/use-email-link-request-page';
import { AuthLayout } from './auth-layout';

export const EmailLinkRequestPage = () => {
  const { form, handleSubmit, isPending, sentTo } = useEmailLinkRequestPage();

  return (
    <AuthLayout>
      <div className="space-y-2">
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
                  Sending link...
                </>
              ) : sentTo ? (
                'Resend link'
              ) : (
                'Send sign-in link'
              )}
            </Button>
          </form>
        </Form>
        {sentTo && (
          <p className="text-sm text-muted-foreground">
            Link sent to{' '}
            <span className="font-medium text-foreground">{sentTo}</span>.
          </p>
        )}
      </div>
    </AuthLayout>
  );
};
