import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getCurrentYear } from '@/shared/lib/get-current-year';
import { getWeekNumber } from '@/shared/lib/get-week-number';
import { useUser } from '@/shared/lib/hooks/use-user';

export const useProtectedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { week, year } = useParams();
  const user = useUser();

  const navigateToAuth = useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      navigateToAuth();
    }

    if (user && (!week || !year) && location.pathname === '/') {
      const currentYear = getCurrentYear();
      const currentWeek = getWeekNumber(new Date());
      navigate(`/${currentYear}/${currentWeek}`, { replace: true });
    }
  }, [user, navigateToAuth, location.pathname]);
};
