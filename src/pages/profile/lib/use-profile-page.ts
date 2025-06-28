import { useUser } from '@/shared/lib';

export const useProfilePage = () => {
  const user = useUser();

  return { user };
};
