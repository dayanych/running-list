import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export const useYearWeekParams = () => {
  const { week, year } = useParams();

  if (!week || !year) {
    toast.error('week and year params are not provided');
    throw new Error('Invalid params');
  }

  return { week: +week, year: +year };
};
