import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

import { AuthDal } from '@/entities/auth';
import { setUser } from '@/entities/user/model/slice/user.slice';

import { CreateAccountShema } from '../model/schemes/create-account-scheme';

export const useSignUpPage = () => {
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof CreateAccountShema>>({
    resolver: zodResolver(CreateAccountShema),
  });

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (data: z.infer<typeof CreateAccountShema>) =>
      AuthDal.register({
        email: data.email,
        password: data.password,
        name: data.username,
      }),
    onSuccess: (currentUser) => {
      if (currentUser) {
        dispatch(setUser(currentUser));
      }
    },
    meta: { showToast: false },
  });

  const handleSubmit = (data: z.infer<typeof CreateAccountShema>) =>
    signUp(data);

  return { form, isPending, handleSubmit };
};
