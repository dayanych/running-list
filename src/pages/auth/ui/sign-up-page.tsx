import { Button, Form, FormField, FormItem, Input } from '@/shared/ui';

import { useSignUpPage } from '../lib/use-sign-up-page';
import { AuthLayout } from './auth-layout';

export const SignUpPage = () => {
  const { form, handleSubmit } = useSignUpPage();

  return (
    <AuthLayout state="signUp">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem required label="Username">
                <Input {...field} />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem required label="Confirm password">
                <Input {...field} />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Registartion
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};
