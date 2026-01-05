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
import { AuthLayout } from './auth-layout';

export const SignUpPage = () => {
  const { form, handleSubmit, isPending } = useSignUpPage();

  return (
    <AuthLayout>
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
                <PasswordInput {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem required label="Confirm password">
                <PasswordInput {...field} />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Registartion'
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};
