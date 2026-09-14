import { LuLoaderCircle } from 'react-icons/lu';

import {
  Button,
  Form,
  FormField,
  FormItem,
  Input,
  PasswordInput,
} from '@/shared/ui';

import { useSignInPage } from '../lib/use-sign-in-page';
import {
  authButtonClassName,
  authInputClassName,
  authLabelClassName,
  authPasswordInputClassName,
} from './auth-form-classes';
import { AuthLayout } from './auth-layout';

export const SignInPage = () => {
  const { form, handleSubmit, isPending } = useSignInPage();

  return (
    <AuthLayout>
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
                  autoComplete="username"
                  placeholder="you@example.com"
                  className={authInputClassName}
                  required
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem label="Password" labelClassName={authLabelClassName}>
                <PasswordInput
                  {...field}
                  autoComplete="current-password"
                  className={authPasswordInputClassName}
                  required
                />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={authButtonClassName}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};
