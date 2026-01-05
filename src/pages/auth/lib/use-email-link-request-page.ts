import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AuthDal } from '@/entities/auth';

import { EmailLinkScheme } from '../model/schemes/email-link-scheme';
import { saveEmailForSignIn } from './email-link-storage';

export const useEmailLinkRequestPage = () => {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<z.infer<typeof EmailLinkScheme>>({
    resolver: zodResolver(EmailLinkScheme),
  });

  const { mutateAsync: sendEmailLink, isPending } = useMutation({
    mutationKey: ['send-email-link'],
    mutationFn: ({ email }: z.infer<typeof EmailLinkScheme>) =>
      AuthDal.sendEmailLink(email),
    onSuccess: (isSent, variables) => {
      if (!isSent) return;
      saveEmailForSignIn(variables.email);
      setSentTo(variables.email);
    },
    meta: { showToast: false },
  });

  const handleSubmit = (data: z.infer<typeof EmailLinkScheme>) =>
    sendEmailLink(data);

  return { form, handleSubmit, isPending, sentTo };
};
