import { LuLoaderCircle } from 'react-icons/lu';

import {
  Button,
  Form,
  FormField,
  FormItem,
  Input,
  PasswordInput,
} from '@/shared/ui';

import { useSignUpPage } from '../lib/use-sign-up-page';
import {
  authButtonClassName,
  authInputClassName,
  authLabelClassName,
  authPasswordInputClassName,
} from './auth-form-classes';
import { AuthLayout } from './auth-layout';

export const SignUpPage = () => {
  const { form, handleSubmit, isPending } = useSignUpPage();

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
            name="username"
            render={({ field }) => (
              <FormItem label="Username" labelClassName={authLabelClassName}>
                <Input
                  {...field}
                  autoComplete="name"
                  className={authInputClassName}
                  required
                />
              </FormItem>
            )}
          />
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
                  autoComplete="new-password"
                  className={authPasswordInputClassName}
                  required
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem
                label="Confirm password"
                labelClassName={authLabelClassName}
              >
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
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
                Processing...
              </>
            ) : (
              'Registration'
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};
