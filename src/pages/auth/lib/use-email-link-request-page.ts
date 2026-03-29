import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import { AuthDal } from '@/entities/auth';
import { setUser } from '@/entities/user/model/slice/user.slice';

import { EmailLinkScheme } from '../model/schemes/email-link-scheme';
import { saveEmailForSignIn } from './email-link-storage';

export const useEmailLinkRequestPage = () => {
  const dispatch = useDispatch();
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

  const { mutateAsync: signInWithGoogle, isPending: isGooglePending } =
    useMutation({
      mutationKey: ['sign-in-google'],
      mutationFn: () => AuthDal.signInWithGoogle(),
      onSuccess: (currentUser) => {
        if (currentUser) {
          dispatch(setUser(currentUser));
        }
      },
      meta: { showToast: false },
    });

  const handleSubmit = (data: z.infer<typeof EmailLinkScheme>) =>
    sendEmailLink(data);

  const handleGoogleSignIn = () => signInWithGoogle();

  return {
    form,
    handleSubmit,
    isPending,
    sentTo,
    handleGoogleSignIn,
    isGooglePending,
  };
};
