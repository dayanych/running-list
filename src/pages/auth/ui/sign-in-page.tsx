import { Button } from '@/shared/ui/shadcn/button';
import { Form, FormField } from '@/shared/ui/shadcn/form';
import { FormItem } from '@/shared/ui/shadcn/form-item';
import { Input } from '@/shared/ui/shadcn/input';

import { useSignInPage } from '../lib/use-sign-in-page';
import { AuthLayout } from './auth-layout';

export const SignInPage = () => {
  const { form, handleSubmit } = useSignInPage();

  return (
    <AuthLayout state="signIn">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem required label="Email">
                <Input {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem required label="Password">
                <Input {...field} />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};
