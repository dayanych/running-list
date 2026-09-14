import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import { AuthDal } from '@/entities/auth';
import { setUser } from '@/entities/user/model/slice/user.slice';
import { notify } from '@/shared/ui/toaster/notify';

import { EmailLinkScheme } from '../model/schemes/email-link-scheme';
import { saveEmailForSignIn } from './email-link-storage';

type SentStateTransitionDirection = 'idle' | 'forward' | 'backward';

export const useEmailLinkRequestPage = () => {
  const dispatch = useDispatch();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [transitionDirection, setTransitionDirection] =
    useState<SentStateTransitionDirection>('idle');
  const form = useForm<z.infer<typeof EmailLinkScheme>>({
    resolver: zodResolver(EmailLinkScheme),
  });

  const { mutateAsync: sendEmailLink, isPending } = useMutation({
    mutationKey: ['send-email-link'],
    mutationFn: ({ email }: z.infer<typeof EmailLinkScheme>) =>
      AuthDal.sendEmailLink(email),
    onSuccess: (isSent, variables) => {
      if (!isSent) return;
      // A resend leaves the screen unchanged, so confirm it explicitly
      if (sentTo) {
        notify.success('New sign-in link sent');
      } else {
        setTransitionDirection('forward');
      }
      saveEmailForSignIn(variables.email);
      setSentTo(variables.email);
    },
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
    });

  const handleSubmit = (data: z.infer<typeof EmailLinkScheme>) =>
    sendEmailLink(data);

  /**
   * Returns to the form so the link can go to another address
   */
  const handleChangeEmail = () => {
    setTransitionDirection('backward');
    setSentTo(null);
  };

  const handleGoogleSignIn = () => signInWithGoogle();

  return {
    form,
    handleSubmit,
    isPending,
    sentTo,
    transitionDirection,
    handleChangeEmail,
    handleGoogleSignIn,
    isGooglePending,
  };
};
