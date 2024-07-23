import { useSelector } from 'react-redux';

import { selectUser } from '@/entities/user/model/slice/user.slice';

export const useUser = () => {
  const { user } = useSelector(selectUser);

  return user;
};
