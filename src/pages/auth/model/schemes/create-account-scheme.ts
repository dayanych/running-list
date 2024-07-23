import { z } from 'zod';

export const CreateAccountShema = z
  .object({
    username: z.string({ required_error: 'Username is required' }),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8),
    confirmPassword: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });
