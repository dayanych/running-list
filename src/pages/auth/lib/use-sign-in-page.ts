import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import { AuthDal } from '@/entities/auth';
import { setUser } from '@/entities/user/model/slice/user.slice';

import { LoginAccountShema } from '../model/schemes/login-account-scheme';

export const useSignInPage = () => {
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof LoginAccountShema>>({
    resolver: zodResolver(LoginAccountShema),
  });

  const { mutateAsync: signIn, isPending } = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: (data: z.infer<typeof LoginAccountShema>) =>
      AuthDal.login(data),
    onSuccess: (currentUser) => {
      if (currentUser) {
        dispatch(setUser(currentUser));
      }
    },
    meta: { showToast: false },
  });

  const handleSubmit = (data: z.infer<typeof LoginAccountShema>) =>
    signIn(data);

  return { form, isPending, handleSubmit };
};
