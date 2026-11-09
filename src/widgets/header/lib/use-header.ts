import { useUser } from '@/shared/lib';

export const useHeader = () => {
  const user = useUser();

  return { user };
};
