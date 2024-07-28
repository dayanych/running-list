import { useWeekPage } from '../lib/use-week-page';
import { TasksTable } from './tasks-table';

export const WeekPage = () => {
  const { startWeekDate, tasksWithStates, isLoading, isError } = useWeekPage();

  return (
    <div className="container">
      <h1>Week Page</h1>
      <TasksTable
        data={tasksWithStates ?? []}
        startWeekDate={startWeekDate}
        loading={isLoading}
        error={isError}
      />
    </div>
  );
};
