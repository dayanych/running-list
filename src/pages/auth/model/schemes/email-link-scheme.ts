import { z } from 'zod';

export const EmailLinkScheme = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),
});
