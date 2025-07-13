import { useQuery } from '@tanstack/react-query';
import { getWeek, getYear, setWeek, startOfWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

import { StatesDal } from '@/entities/states';
import { TasksDal } from '@/entities/tasks';
import { dateConfig } from '@/shared/config';
import { useUser, useYearWeekParams } from '@/shared/lib';

import { TaskWithStates } from '../ui/tasks-table';

const getStartDateOfWeek = (week: number, year: number) => {
  const date = setWeek(new Date(year, 0, 1), week);
  return startOfWeek(date, { weekStartsOn: dateConfig.weekStart });
};

export const useWeekPage = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { year, week } = useYearWeekParams();

  const {
    data: tasksWithStates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getTasks', user?.id, year, week],
    queryFn: async () => {
      if (!user) return;

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

    navigate(`/${updatedYear}/${updatedWeek}`);
  };

  return {
    startWeekDate: getStartDateOfWeek(week, year),
    tasksWithStates,
    isLoading,
    isError,
    handleWeekChange,
  };
};
