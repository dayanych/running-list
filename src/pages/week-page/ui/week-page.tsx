import { useWeekPage } from '../lib/use-week-page';
import { CreateTaskInput } from './create-task-input';
import { TasksTable } from './tasks-table';
import { WeekTitle } from './week-title';

export const WeekPage = () => {
  const { startWeekDate, tasksWithStates, isLoading, isError, handleWeekChange } =
    useWeekPage();

  return (
    <div className="container flex flex-col gap-4">
      <WeekTitle startWeekDate={startWeekDate} onChange={handleWeekChange} />
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
