import { useWeekPage } from '../lib/use-week-page';
import { CreateTaskInput } from './create-task-input';
import { TasksTable } from './tasks-table';

export const WeekPage = () => {
  const { startWeekDate, tasksWithStates, isLoading, isError } = useWeekPage();

  return (
    <div className="container flex flex-col gap-4">
      <h1>Week Page</h1>
      <CreateTaskInput />
      <TasksTable
        data={tasksWithStates ?? []}
        startWeekDate={startWeekDate}
        loading={isLoading}
        error={isError}
      />
    </div>
  );
};
