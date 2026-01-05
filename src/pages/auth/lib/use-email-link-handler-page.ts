import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { AuthDal } from '@/entities/auth';
import { setUser } from '@/entities/user/model/slice/user.slice';
import { routesPaths } from '@/shared/config';

import { EmailLinkScheme } from '../model/schemes/email-link-scheme';
import { clearEmailForSignIn, getEmailForSignIn } from './email-link-storage';

export const useEmailLinkHandlerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedEmail = useMemo(() => getEmailForSignIn(), []);
  const link = useMemo(() => window.location.href, []);
  const isLinkValid = useMemo(() => AuthDal.isEmailLink(link), [link]);
  const [hasFailed, setHasFailed] = useState(false);
  const autoAttemptedRef = useRef(false);

  const form = useForm<z.infer<typeof EmailLinkScheme>>({
    resolver: zodResolver(EmailLinkScheme),
    defaultValues: {
      email: storedEmail ?? '',
    },
  });

  const { mutateAsync: confirmLink, isPending } = useMutation({
    mutationKey: ['email-link-sign-in'],
    mutationFn: ({ email }: z.infer<typeof EmailLinkScheme>) =>
      AuthDal.signInWithEmailLink(email, link),
    onSuccess: (currentUser) => {
      if (currentUser) {
        dispatch(setUser(currentUser));
        clearEmailForSignIn();
        navigate(`/${routesPaths.base}`);
      } else {
        setHasFailed(true);
      }
    },
    meta: { showToast: false },
  });

  useEffect(() => {
    if (!isLinkValid || !storedEmail || autoAttemptedRef.current) return;
    autoAttemptedRef.current = true;
    void confirmLink({ email: storedEmail });
  }, [confirmLink, isLinkValid, storedEmail]);

  const handleSubmit = (data: z.infer<typeof EmailLinkScheme>) => {
    setHasFailed(false);
    return confirmLink(data);
  };

  return {
    form,
    handleSubmit,
    isPending,
    isLinkValid,
    hasFailed,
    needsEmail: !storedEmail || hasFailed,
  };
};
