import { useQuery } from '@tanstack/react-query';
import { getWeek, getYear, setWeek, startOfWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import { dateConfig } from '@/shared/config/date.config';
import { useUser } from '@/shared/lib/hooks/use-user';
import { useYearWeekParams } from '@/shared/lib/hooks/use-year-week-params';

import { TaskWithStates } from '../ui/tasks-table';

const getStartDateOfWeek = (week: number, year: number) => {
  const date = setWeek(new Date(year, 0, 1), week);
  return startOfWeek(date, { weekStartsOn: dateConfig.weekStart });
};

export const useWeekPage = () => {
  const user = useUser();
  const { year, week } = useYearWeekParams();
  const navigate = useNavigate();

  if (!user || !year || !week) {
    toast.error('User, year, or week not provided');
    throw new Error('User, year, or week not provided');
  }

  const {
    data: tasksWithStates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getTasks', user.id, year, week],
    queryFn: async () => {
      const tasks = await TasksDal.getTasksByUserIdYearWeek(
        user.id,
        year,
        week,
      );
      const tasksWithStates: TaskWithStates[] = await Promise.all(
        tasks.map(async (task) => {
          const states = await StatesDal.getStatesByTaskId(task.id);
          return { ...task, states };
        }),
      );

      return tasksWithStates;
    },
  });

  const handleWeekChange = (date: DateRange) => {
    if (!date.from || !date.to) return;

    const updatedWeek = getWeek(date.from);
    const updatedYear = getYear(date.from);

    navigate(`/app/${updatedYear}/${updatedWeek}`);
  };

  return {
    startWeekDate: getStartDateOfWeek(week, year),
    tasksWithStates,
    isLoading,
    isError,
    handleWeekChange,
  };
};
