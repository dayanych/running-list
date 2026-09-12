import { useParams } from 'react-router-dom';

import { notify } from '@/shared/ui/toaster/notify';

export const useWeeksParams = () => {
  const { week, year } = useParams();

  if (!week || !year) {
    notify.error('This week could not be opened. The address is incomplete');
    throw new Error('Invalid params');
  }

  return { week: +week, year: +year };
};
