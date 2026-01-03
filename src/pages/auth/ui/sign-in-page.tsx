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
import { AuthLayout } from './auth-layout';

export const SignInPage = () => {
  const { form, handleSubmit, isPending } = useSignInPage();

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
                <PasswordInput {...field} />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
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
