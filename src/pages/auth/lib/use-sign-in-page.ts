import { zodResolver } from '@hookform/resolvers/zod';
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

  const handleSubmit = async (data: z.infer<typeof LoginAccountShema>) => {
    const currentUser = await AuthDal.login(data);
    dispatch(setUser(currentUser));
  };

  return { form, handleSubmit };
};
