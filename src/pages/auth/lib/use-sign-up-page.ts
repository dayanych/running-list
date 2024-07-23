import { zodResolver } from '@hookform/resolvers/zod';
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

  const handleSubmit = async (data: z.infer<typeof CreateAccountShema>) => {
    const currentUser = await AuthDal.register({
      email: data.email,
      password: data.password,
      name: data.username,
    });
    dispatch(setUser(currentUser));
  };

  return { form, handleSubmit };
};
